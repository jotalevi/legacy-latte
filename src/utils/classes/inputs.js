const newUserInput = {
    username: {
        type: String,
        length: {
            min: 4,
            max: 16,
        },
        forbidenChars: [
            "+",
            "#",
            "@",
            "!",
            "=",
            "-",
        ],
        requiredChars: [],
        regx: [],
    }
}