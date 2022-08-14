export type MonophthongPhoneme = {
    ipa: string
    sampa: string
    length: string
    tenseness: string
    roundedness: string
    horizontal: string
    vertical: string
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

export type Question = {
    question: string
    classes: string[]
}

export type MistakeType = {
    guessedPhoneme: VowelPhoneme | ConsonantPhoneme
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