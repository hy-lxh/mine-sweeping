module.exports = {
    tabWidth: 4,
    semi: true,
    singleQuote: true,
    trailingComma: 'all',
    overrides: [
        {
            files: ['*.ts'],
            options: {
                parser: 'typescript'
            }
        },
        {
            files: ['*.css'],
            options: {
                parser: 'css'
            }
        }
    ]
}
