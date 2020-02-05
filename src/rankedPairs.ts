// Ranked pairs

// This is a Condorcet method, guaranteed to elect the Condorcet winner. That is
// the candidate, if one exists, who beats every other in one-to-one comparisons.

// Tally the vote count comparing each pair of candidates, and determine the
// winner of each pair (provided there is not a tie)
// Sort (rank) each pair, by the largest strength of victory first to smallest
// last.[vs 1]
// "Lock in" each pair, starting with the one with the largest number of winning
// votes, and add one in turn to a graph as long as they do not create a cycle
// (which would create an ambiguity). The completed graph shows the winner.

// Helper functions

// For a given candidate in a given ballot, count him as higher than all
// subsequent candidates
function tallyCandidate(currentCandidate: Candidate) {
  return function tallyClosure(cumulativePairs: Pairs,
    losingCandidate: Candidate): Pairs {
    const currentPair: StringPair = JSON
      .stringify([currentCandidate, losingCandidate]);
    if (cumulativePairs.has(currentPair)) {
      return cumulativePairs.set(
        currentPair, cumulativePairs.get(currentPair) as number + 1,
      );
    }
    return cumulativePairs.set(currentPair, 1);
  };
}

// Given a current tally and a new ballot, return a new tally with that ballot
// included
export function tallyBallotPairs(pairs: Pairs, ballot: Ballot): Pairs {
  if (ballot.length === 0) {
    return pairs;
  }
  const [currentCandidate, ...otherCandidates] = ballot;
  const newPairs = otherCandidates
    .reduce(tallyCandidate(currentCandidate), pairs);
  return tallyBallotPairs(newPairs, otherCandidates);
}

// Create the winner's side of the node
function winnerNode(graph: Graph, winner: Candidate, loser: Candidate): Graph {
  if (graph[winner]) {
    graph[winner].defeats.push(loser);
    return graph;
  }
  const newGraph = { ...graph };
  newGraph[winner] = { defeats: [loser], defeatedBy: [], winners: [] };
  return newGraph;
}

// (Naively?) finds all candidates which beat this one through some path
function findWinners(
  graph: Graph, loser: Candidate, winner: Candidate,
): Candidate[] {
  return graph[loser].winners
    .concat(
      graph[winner].winners
        .filter((candidate) => !graph[loser].winners.includes(candidate)),
    )
    .concat(winner);
}

// Create the loser's side of the node
function loserNode(graph: Graph, loser: Candidate, winner: Candidate): Graph {
  const newGraph = { ...graph } as Graph;
  if (newGraph[loser]) {
    newGraph[loser].defeatedBy.push(winner);
    newGraph[loser].winners = findWinners(newGraph, loser, winner);
    return newGraph;
  }
  newGraph[loser] = {
    defeats: [],
    defeatedBy: [winner],
    winners: [...graph[winner].winners, winner],
  };
  return newGraph;
}

// Add a new node to the graph, showing the first candidate defeats the second
function createNode(graph: Graph, winner: Candidate, loser: Candidate): Graph {
  let newGraph = { ...graph } as Graph;
  // Make the winner know about their loser
  newGraph = winnerNode(newGraph, winner, loser);
  // Make the loser know about this direct winner, and all other winners above
  newGraph = loserNode(newGraph, loser, winner);
  return newGraph;
}

// See if a node for this winner and loser is needed, creating it if so
function createNodeIfNeeded(graph: Graph, [winner, loser]: Pair): Graph {
  // If inserting a node would create a cycle, don't insert it
  if (graph[winner] && graph[winner].winners.includes(loser)) {
    return graph;
  }
  return createNode(graph, winner, loser);
}

// Functions whose composition implements the voting method
// 1 - turn the list of ballots into a count of how many times a given candidate
// is preferred over another one. For example, saying that Jeb! is preferred
// over Governor Polis by 757,638 voters.
export function tallyPairs(votes: Ballot[]): Pairs {
  const initialTally: Pairs = new Map();
  return votes.reduce(tallyBallotPairs, initialTally);
}

// 2 - sort (rank) the list of pairs, from strongest to weakest margin of
// victory. Here I get rid of the JSON string I had to include in the function
// above.
export function sortPairs(pairs: Pairs): RankedPairs {
  return Array
    .from(pairs.entries())
    .sort((pair1, pair2) => pair2[1] - pair1[1])
    .map((pair) => JSON.parse(pair[0]));
}

// 3 - Create a direct acyclical graph (here, hopefully, represented by a humble
// object) to figure out the order of the candidates
export function buildGraph(pairs: RankedPairs): Graph {
  return pairs.reduce(createNodeIfNeeded, {} as Graph);
}

// Find the source of the graph, who is the winner of the election
export function findSource(graph: Graph): Candidate {
  let winner = '';
  Object.entries(graph).forEach(([candidate, candidateData]) => {
    if (candidateData.defeatedBy.length === 0) {
      winner = candidate;
    }
  });
  return winner;
}

// Main function. Calls, in order, the functions that turn ballots into
export default function rankedPairs(votes: Ballot[]): Candidate {
  // The |> operator cannot make its way into ECMAScript even one day too soon!
  return findSource(buildGraph(sortPairs(tallyPairs(votes))));
}
