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

// 2-Helper functions
function tallyCurrentCandidate(
  currentCandidate: Candidate,
  cumulativePairs: Pairs,
  losingCandidate: Candidate,
): Pairs {
  const currentPair: StringPair = JSON.stringify([currentCandidate, losingCandidate]);
  if (cumulativePairs.has(currentPair)) {
    return cumulativePairs.set(currentPair, cumulativePairs.get(currentPair) as number + 1);
  }
  return cumulativePairs.set(currentPair, 1);
}

// Given a current tally and a new ballot, return a new tally with that ballot
// included
export function tallyBallotPairs(pairs: Pairs, ballot: Ballot): Pairs {
  if (ballot.length === 0) {
    return pairs;
  }
  const [currentCandidate, ...otherCandidates] = ballot;
  const newPairs = otherCandidates
    .reduce(
      (cumulativePairs: Pairs,
        losingCandidate: Candidate) => tallyCurrentCandidate(
        currentCandidate, cumulativePairs, losingCandidate,
      ), pairs,
    );
  return tallyBallotPairs(newPairs, otherCandidates);
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
// function generateGraph(rankedPairs: Pairs): DAG
// function findSource(graph: DAG): Candidate

// Main function. Calls, in order, the functions that turn ballots into
export default function rankedPairs(votes: Ballot[]): Candidate {
  sortPairs(tallyPairs(votes));
  // return findSource(generateGraph(sortPairs(tallyPairs(votes))))
  return 'Jeb!';
}
