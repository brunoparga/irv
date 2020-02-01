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

// Functions I need
export function tallyPairs(votes: Ballot[]): Pairs {
  const initialTally: Pairs = new Map();
  return votes.reduce(tallyBallotPairs, initialTally);
}
export function sortPairs(pairs: Pairs): RankedPairs {
  return Array
    .from(pairs.entries())
    .sort((pair1, pair2) => pair2[1] - pair1[1])
    .map((pair) => [JSON.parse(pair[0]), pair[1]]);
}
// function generateGraph(rankedPairs: Pairs): DAG
// function findSource(graph: DAG): Candidate

export default function rankedPairs(votes: Ballot[]): Candidate {
  tallyPairs(votes);
  // return findSource(generateGraph(sortPairs(tallyPairs(votes))))
  return 'Jeb!';
}
