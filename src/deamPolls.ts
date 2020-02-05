import fs from 'fs';
// import IRV_IIA from './irv-iia';
import rankedPairs from './rankedPairs';

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

// IRV_IIA(anonymizedVotes);
console.log(rankedPairs(anonymizedVotes));
