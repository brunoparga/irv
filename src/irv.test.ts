import { eliminate, evaluate, tallyVotes } from './irv';

const election = [
  ['Jeb!', 'Butti', 'Mutti'],
  ['Jeb!', 'Mutti', 'Butti'],
  ['Jeb!', 'Mutti', 'Butti'],
  ['Jeb!', 'Mutti', 'Butti'],
  ['Jeb!', 'Butti', 'Mutti'],
  ['Butti', 'Jeb!', 'Mutti'],
  ['Butti', 'Jeb!', 'Mutti'],
  ['Butti', 'Mutti', 'Jeb!'],
  ['Butti', 'Mutti', 'Jeb!'],
  ['Mutti', 'Butti', 'Jeb!'],
  ['Mutti', 'Jeb!', 'Butti'],
  ['Mutti', 'Jeb!', 'Butti'],
];

const anotherElection = [
  ['Jeb!', 'Cheeto Mussolini', 'Eric Swalwell'],
  ['Jeb!', 'Eric Swalwell', 'Cheeto Mussolini'],
  ['Jeb!', 'Cheeto Mussolini', 'Eric Swalwell'],
];

const tallyWithWinner = {
  'Jeb!': 100,
  birb: 0,
  'Cheeto Mussolini': 0,
  'Uncle Joe': 99,
};

const tallyWithoutWinner = {
  'Jeb!': 100,
  BootyJudge: 99,
  birb: 0,
  'Cheeto Mussolini': 0,
  'Uncle Joe': 99,
};

test('tallyVotes correctly tallies votes', () => {
  expect(tallyVotes(election)).toEqual({ 'Jeb!': 5, Butti: 4, Mutti: 3 });
});

test('evaluate declares the correct winner when there is one', () => {
  expect(evaluate(tallyWithWinner)).toBe('Jeb!');
});

test('evaluate returns null when there is no winner', () => {
  expect(evaluate(tallyWithoutWinner)).toBeNull();
});

test('eliminate removes the candidates from all ballots', () => {
  expect(eliminate(anotherElection, tallyVotes(anotherElection)))
    .toEqual([['Jeb!'], ['Jeb!'], ['Jeb!']]);
});
