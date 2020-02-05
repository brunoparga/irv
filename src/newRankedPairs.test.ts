import {
  buildGraph, findSource, sortPairs, tallyPairs,
} from './rankedPairs';
import testBallots from './testData';

const pairs = new Map() as Pairs;
pairs.set(JSON.stringify(['Warren', 'Yang']), 7);
pairs.set(JSON.stringify(['Warren', 'Biden']), 7);
pairs.set(JSON.stringify(['Yang', 'Biden']), 7);
pairs.set(JSON.stringify(['Sanders', 'Biden']), 6);
pairs.set(JSON.stringify(['Warren', 'Sanders']), 5);
pairs.set(JSON.stringify(['Sanders', 'Yang']), 5);
pairs.set(JSON.stringify(['Yang', 'Sanders']), 4);
pairs.set(JSON.stringify(['Sanders', 'Warren']), 4);
pairs.set(JSON.stringify(['Biden', 'Sanders']), 3);
pairs.set(JSON.stringify(['Biden', 'Yang']), 2);
pairs.set(JSON.stringify(['Biden', 'Warren']), 2);
pairs.set(JSON.stringify(['Yang', 'Warren']), 2);

const sortedPairs = [
  ['Warren', 'Yang'],
  ['Warren', 'Biden'],
  ['Yang', 'Biden'],
  ['Sanders', 'Biden'],
  ['Warren', 'Sanders'],
  ['Sanders', 'Yang'],
  ['Yang', 'Sanders'],
  ['Sanders', 'Warren'],
  ['Biden', 'Sanders'],
  ['Biden', 'Yang'],
  ['Biden', 'Warren'],
  ['Yang', 'Warren'],
] as RankedPairs;

const graph: Graph = {
  Warren: {
    defeats: ['Yang', 'Biden', 'Sanders'],
    defeatedBy: [],
    winners: [],
  },
  Yang: {
    defeats: ['Biden'],
    defeatedBy: ['Warren', 'Sanders'],
    winners: ['Warren', 'Sanders'],
  },
  Biden: {
    defeats: [],
    defeatedBy: ['Warren', 'Yang', 'Sanders'],
    winners: ['Warren', 'Yang', 'Sanders'],
  },
  Sanders: {
    defeats: ['Biden', 'Yang'],
    defeatedBy: ['Warren'],
    winners: ['Warren'],
  },
};

test('tallyPairs', () => expect(tallyPairs(testBallots)).toEqual(pairs));
test('sortPairs', () => expect(sortPairs(pairs)).toEqual(sortedPairs));
test('generateGraph', () => expect(buildGraph(sortedPairs)).toEqual(graph));
test('findSource', () => expect(findSource(graph)).toEqual('Warren'));
