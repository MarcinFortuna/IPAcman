export type MonophthongPhoneme = {
    ipa: string
    sampa: string
    length: string
    tenseness: string
    roundedness: string
    height: string
    backness: string
}

export type DiphthongPhoneme = {
    ipa: string
    sampa: string
    length: string
    type: string
}

export type VowelPhoneme = MonophthongPhoneme | DiphthongPhoneme

export type ConsonantPhoneme = {
    ipa: string
    sampa: string
    category: string
    manner: string
    place: string
    voice: string
}

export type Phoneme = VowelPhoneme | ConsonantPhoneme

export type Question = {
    question: string
    classes: string[]
}

export type MistakeType = {
    guessedPhoneme: Phoneme
    guessedQuestion: Question
}

export type PreviousResults = {
    datetime: string
    results: string[][]
    score: number
}

export type UserData = {
    userDbKey?: string
    username: string
    displayName: string
    affiliation?: string
}

export type LeaderboardItem = {
    name: string
    displayName?: string
    affiliation?: string
    pace: string
    score: number
    datetime: string
}

export type ObjectToPushToFirebase = {
    score: number,
    uid: string,
    pace: number,
    mistakes: MistakeType[],
    timestamp: string,
    username: string,
    displayName: string,
    affiliation: string
}

export type GridElement = [
    string, Phoneme | string
]

export type BoardGrid = GridElement[][]

export type MainComponentState = {
    gameOn: boolean
    currentlySearched: Question
    phonemesOnTheBoard: (GridElement | null)[]
    score: number
    life: number
    mistakes: MistakeType[]
    modalOpen: boolean
    pace: number
    // useIpa: boolean
    user: any
}