// Instant-runoff voting

// Defining types

type Candidate = string;
type Ballot = Candidate[];
type Tally = Record<Candidate, number>;

// Helper functions

// evaluate: returns the winning candidate if one exists, null otherwise.
export function evaluate(tally: Tally): Candidate | null {
  // Figure out how many votes there are
  // This could be less than the initial total if voters are allowed to rank
  // only some of the candidates
  const totalVotes = Object
    .values(tally)
    .reduce((sum: number, votes: number): number => sum + votes, 0);

  // Find out who got a majority of votes
  // (more than half, not plurality, which is just the most votes)
  const winner = Object.entries(tally).reduce(
    (answer, tallyEntry): { name: Candidate; votes: number } => {
      if (tallyEntry[1] > totalVotes / 2) {
        return { name: tallyEntry[0], votes: tallyEntry[1] };
      }
      return answer;
    },
    { name: 'Nobody', votes: 0 },
  );

  if (winner.votes > 0) {
    return winner.name;
  }
  return null;
}

// tallyVotes: given a list of votes, return the number of
// first preferences for each candidate
export function tallyVotes(votes: Ballot[]): Tally {
  const initialTally = Object
    .fromEntries(votes[0].map(
      (candidate: Candidate): [Candidate, number] => [candidate, 0],
    ));
  return votes.reduce(
    (currentTally: Tally, ballot: Ballot): Tally => Object
      .defineProperty(
        currentTally,
        ballot[0],
        { value: currentTally[ballot[0]] + 1 },
      ),
    initialTally,
  );
}

// eliminate: given a list of votes and their tally, return a new list of
// votes. This new list excludes the candidates eliminated on this round.
// Initially, this is just the candidates with the least votes (they are all
// eliminated together, this is one tie-breaking method.)
// In the future, I want to improve this: if the last candidate has 1 vote, the
// next has 2, and then all others have 4 or more, the one with 2 votes will
// inevitably fall in the next round, so they should just be dropped now.
export function eliminate(votes: Ballot[], tally: Tally): Ballot[] {
  const minimumVotes = Math.min(...Object.values(tally));
  return votes.map(
    (ballot: Ballot): Ballot => ballot.filter(
      (candidate: Candidate): boolean => tally[candidate] !== minimumVotes,
    ),
  );
}

// Main function
export default function IRV(votes: Ballot[]): Candidate {
  const tally = tallyVotes(votes);
  console.log(tally);
  // Base case: there is a winning candidate
  // evaluate(tally) returns a winner
  const result = evaluate(tally);
  if (result) {
    return result;
  }
  // Eliminate losing candidates (there can be more than one in a round!)
  const newVotes = eliminate(votes, tally);
  // Recurse on the new set of ballots
  return IRV(newVotes);
}
