// RP Phoneme types

export type MonophthongPhonemeRP = {
    ipa: string
    sampa: string
    length: string
    tenseness: string
    roundedness: string
    height: string
    backness: string
}

export type DiphthongPhonemeRP = {
    ipa: string
    sampa: string
    length: string
    type: string
}

export type VowelPhonemeRP = MonophthongPhonemeRP | DiphthongPhonemeRP

// Old entries in Firebase use 'voice' instead of 'voicing'; hence both still need to be supported

export type ConsonantPhonemeRP = {
    ipa: string
    sampa: string
    category: string
    manner: string
    place: string
    voicing?: string
    voice?: string
}

// Full IPA Phoneme types

export type FullConsonant = {
    ipa: string
    sampa: string
    airstream: string
    place: string
    manner: string
    voicing: string
    url: string | URL
    audio: string | URL
}

export type FullVowel = {
    ipa: string
    sampa: string
    backness: string
    height: string
    roundedness: string
    url: string | URL
    audio: string | URL
}

export type Diacritic = {
    ipa: string
    sampa: string
    value: string
    url: string | URL
}

export type ToneWordAccent = {
    ipa_diacritic: string
    ipa_letter: string
    sampa: string
    value: string
    url: string | URL
}

// Aggregate Phonetic Symbol type

export type PhoneticSymbol = VowelPhonemeRP | ConsonantPhonemeRP | FullConsonant | FullVowel | Diacritic | ToneWordAccent

// Other

export type Question = {
    question: string
    classes: string[]
}

export type MistakeType = {
    guessedPhoneme: PhoneticSymbol
    guessedQuestion: Question
}

export type ParsedMistakeType = {
    guessedPhoneme: PhoneticSymbol
    guessedQuestion: string
    correctAnswers: PhoneticSymbol[]
    mode?: string
}

export type PreviousResults = {
    datetime: string
    results: ParsedMistakeType[]
    score: number
    mode: string
}

export type SingleDBResponse = {
    affiliation: string
    displayName: string
    mistakes: MistakeType[] | ParsedMistakeType[]
    pace: number
    score: number
    timestamp: string
    uid: string
    username: string
    mode?: string
}

export type ResultsDBResponse = {
    [key: string]: SingleDBResponse
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
    mode: string
}

export type ObjectToPushToFirebase = {
    score: number
    uid: string
    pace: number
    mistakes: ParsedMistakeType[]
    timestamp: string
    username: string
    displayName: string
    affiliation: string
    mode?: string
}

export type GridElement = [
    string, PhoneticSymbol | string
]

export type BoardGrid = GridElement[][]

export type SymbolScope = {
    selected: 'rp' | 'fullIpa'
    rp: {
        consonants: boolean
        vowels: boolean
    }
    fullIpa: {
        full_consonants_pulmonic: boolean
        full_consonants_non_pulmonic: boolean
        full_other_symbols: boolean
        full_vowels: boolean
        full_diacritics: boolean
        full_suprasegmentals: boolean
        full_tones_and_word_accents: boolean
    }
}