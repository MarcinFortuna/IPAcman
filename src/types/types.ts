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

export type MistakeType = [
    VowelPhoneme|ConsonantPhoneme, Question
]