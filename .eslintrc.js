module.exports = {
    'root': true,
    'overrides': [
        {
            'files': [
                './scripts/**/*.ts'
            ],
            'env': {
                'browser': true,
                'es2021': true
            },
            'extends': [
                'eslint:recommended',
                'plugin:@typescript-eslint/recommended',
                'prettier'
            ],
            'parser': '@typescript-eslint/parser',
            'parserOptions': {
                'ecmaVersion': 6,
                'sourceType': 'module'
            },
            'plugins': [
                '@typescript-eslint'
            ],
            'rules': {
                'indent': [
                    'error',
                    4
                ],
                'linebreak-style': [
                    'error',
                    'unix'
                ],
                'quotes': [
                    'error',
                    'single'
                ],
                'semi': [
                    'error',
                    'always'
                ]
            }
        }
    ],
    
};
