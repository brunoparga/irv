import { sortPairs, tallyBallotPairs } from './rankedPairs';

const ballot = ['Jeb!', 'Butti', 'Macron', 'Tru-doe'] as Ballot;

const emptyPairs = new Map() as Pairs;

// This is what the tally should look like when the first ballot is tallied and
// it ranks Jeb! > Butti > Tru-doe > Macron (unlike the ballot above, that has
// M > T)
const existingPairs = new Map() as Pairs;
existingPairs.set(JSON.stringify(['Jeb!', 'Butti']), 1);
existingPairs.set(JSON.stringify(['Jeb!', 'Tru-doe']), 1);
existingPairs.set(JSON.stringify(['Jeb!', 'Macron']), 1);
existingPairs.set(JSON.stringify(['Butti', 'Tru-doe']), 1);
existingPairs.set(JSON.stringify(['Butti', 'Macron']), 1);
existingPairs.set(JSON.stringify(['Tru-doe', 'Macron']), 1);

// This is a hypothetical tally that perhaps could not even exist in real life.
const sortablePairs = new Map() as Pairs;
sortablePairs.set(JSON.stringify(['Jeb!', 'Butti']), 2);
sortablePairs.set(JSON.stringify(['Jeb!', 'Tru-doe']), 3);
sortablePairs.set(JSON.stringify(['Jeb!', 'Macron']), 3);
sortablePairs.set(JSON.stringify(['Butti', 'Tru-doe']), 5);
sortablePairs.set(JSON.stringify(['Butti', 'Macron']), 4);
sortablePairs.set(JSON.stringify(['Tru-doe', 'Macron']), 1);

test('tallyBallotPairs works with the first ballot', () => {
  const result = new Map() as Pairs;
  result.set(JSON.stringify(['Jeb!', 'Butti']), 1);
  result.set(JSON.stringify(['Jeb!', 'Macron']), 1);
  result.set(JSON.stringify(['Jeb!', 'Tru-doe']), 1);
  result.set(JSON.stringify(['Butti', 'Macron']), 1);
  result.set(JSON.stringify(['Butti', 'Tru-doe']), 1);
  result.set(JSON.stringify(['Macron', 'Tru-doe']), 1);
  expect(tallyBallotPairs(emptyPairs, ballot)).toEqual(result);
});

test('tallyBallotPairs works when there is already a tally', () => {
  const result = new Map();
  result.set(JSON.stringify(['Jeb!', 'Butti']), 2);
  result.set(JSON.stringify(['Jeb!', 'Macron']), 2);
  result.set(JSON.stringify(['Jeb!', 'Tru-doe']), 2);
  result.set(JSON.stringify(['Butti', 'Macron']), 2);
  result.set(JSON.stringify(['Butti', 'Tru-doe']), 2);
  result.set(JSON.stringify(['Macron', 'Tru-doe']), 1);
  result.set(JSON.stringify(['Tru-doe', 'Macron']), 1);
  expect(tallyBallotPairs(existingPairs, ballot)).toEqual(result);
});

test('sortPairs sorts the pairs it receives', () => {
  const result = [];
  result.push(['Butti', 'Tru-doe']);
  result.push(['Butti', 'Macron']);
  result.push(['Jeb!', 'Tru-doe']);
  result.push(['Jeb!', 'Macron']);
  result.push(['Jeb!', 'Butti']);
  result.push(['Tru-doe', 'Macron']);
  expect(sortPairs(sortablePairs)).toEqual(result);
});
