import IRV from './irv';

export default function IRV_IIA(votes: Ballot[]): void {
  console.log(`In the actual election, IRV elects ${IRV(votes)}`);
  votes[0].forEach((removedCandidate) => {
    const votesWithoutCand = votes.map((ballot) => ballot
      .filter((candidate) => candidate !== removedCandidate));
    console.log(`Eliminating ${removedCandidate} elects ${IRV(votesWithoutCand)}`);
  });
}
