import fs from 'fs';
import IRV from './irv';
// import rankedPairs from './rankedPairs';

// First, run this on the console of the results page:
// const votes = JSON.stringify(
//   [...document.querySelectorAll('.responseRow')]
//     .map(vote => [...vote.querySelectorAll('td')]
//       .map(td => td.innerText))
// );
// Type 'votes' to get the JSON string, then copy/paste it into votes.json

const votes: string[][] = JSON.parse(fs.readFileSync('votes.json', {
  encoding: 'utf-8',
}));
const seenVoters: string[] = [];
const filteredVotes: string[][] = [];
votes.forEach((vote) => {
  if (!seenVoters.includes(vote[3].toLowerCase())) {
    seenVoters.push(vote[3].toLowerCase());
    filteredVotes.push(vote);
  }
});
const anonymizedVotes = filteredVotes.map((vote) => vote.slice(4, 20));

console.log(`In the actual election, IRV elects ${IRV(anonymizedVotes)}`);
anonymizedVotes[0].forEach((removedCandidate) => {
  const votesWithoutCand = anonymizedVotes.map((ballot) => ballot
    .filter((candidate) => candidate !== removedCandidate));
  console.log(`Eliminating ${removedCandidate} elects ${IRV(votesWithoutCand)}`);
});
// console.log(rankedPairs(anonymizedVotes));
