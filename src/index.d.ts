type Candidate = string;
type Ballot = Candidate[];
type Tally = Record<Candidate, number>;
// The pair [X, Y] means X is preferred over Y
type Pair = [Candidate, Candidate]
// Pair must be stringified because JavaScript
type StringPair = string;
type Pairs = Map<StringPair, number>
type RankedPairs = Pair[]
interface CandidateData {
  defeats: Candidate[];
  defeatedBy: Candidate[];
  allWhoBeatThis: Candidate[];
}
type Graph = Record<Candidate, CandidateData>
