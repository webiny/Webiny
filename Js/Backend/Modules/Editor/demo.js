export default {
    "entityMap": {
        "0": {
            "type": "CODE-QUOTE",
            "mutability": "MUTABLE",
            "data": {}
        },
        "1": {
            "type": "code-block",
            "mutability": "IMMUTABLE",
            "data": {
                "code": "<Ui.ClickSuccess message={<span>Your purchase is now completed!<br/>Thank you for shopping with us!</span>}>\n    {success => (\n        <Ui.ClickConfirm message=\"This will charge your card with $15.99. Proceed?\" onComplete={success}>\n            <Ui.Button type=\"primary\" label=\"Charge my credit card\" onClick={() => {\n                return new Promise(r => setTimeout(r, 1500));\n            }}/>\n        </Ui.ClickConfirm>\n    )}\n</Ui.ClickSuccess>",
                "language": "jsx"
            }
        },
        "2": {
            "type": "code-block",
            "mutability": "IMMUTABLE",
            "data": {
                "code": "<?php\n/**\n * Webiny Platform (http://www.webiny.com/)\n *\n * @copyright Copyright Webiny LTD\n */\n\nnamespace Apps\\Core\\Php\\Dispatchers;\n\nuse Apps\\Core\\Php\\DevTools\\WebinyTrait;\nuse Apps\\Core\\Php\\DevTools\\Response\\ApiRawResponse;\nuse Apps\\Core\\Php\\Discover\\Postman;\nuse Apps\\Core\\Php\\RequestHandlers\\ApiEvent;\n\nclass DiscoverDispatcher extends AbstractApiDispatcher\n{\n    use WebinyTrait;\n\n    public function handle(ApiEvent $event)\n    {\n        $apiUrl = $event->getUrl();\n        if ($apiUrl->startsWith('/discover')) {\n            $this->checkApiToken();\n            $app = $apiUrl->replace('/discover/', '')->pascalCase()->val();\n            $docs = new Postman();\n\n            return new ApiRawResponse($docs->generate($app));\n        }\n    }\n}",
                "language": "php"
            }
        },
        "3": {
            "type": "react-sandbox",
            "mutability": "IMMUTABLE",
            "data": {
                "code": "<Ui.ClickSuccess message={<span>Your purchase is now completed!<br/>Thank you for shopping with us!</span>}>\n    {success => (\n        <Ui.ClickConfirm message=\"This will charge your card with $15.99. Proceed?\" onComplete={success}>\n            <Ui.Button type=\"primary\" label=\"Charge my credit card\" onClick={() => {\n                return new Promise(r => setTimeout(r, 1500));\n            }}/>\n        </Ui.ClickConfirm>\n    )}\n</Ui.ClickSuccess>"
            }
        },
        "4": {
            "type": "react-sandbox",
            "mutability": "IMMUTABLE",
            "data": {
                "code": "<Ui.Form>\n  {(model) => (\n    <Ui.Grid.Row>\n      <Ui.Grid.Col all={12}>\n\t\t<Ui.Input placeholder=\"Enter your email\" label=\"Email\" name=\"email\" validate=\"required,email\"/>\n        <Ui.Input placeholder=\"Enter your name\" label=\"Name\" name=\"name\" validate=\"required\"/>\n      </Ui.Grid.Col>\n      <Ui.Grid.Col all={12}>\n        <br/><br/>\n        Form model:\n        <pre>{JSON.stringify(model, null, 4)}</pre>\n      </Ui.Grid.Col>\n    </Ui.Grid.Row>\n  )}\n</Ui.Form>"
            }
        },
        "5": {
            "type": "table",
            "mutability": "IMMUTABLE",
            "data": {
                "headers": [
                    {
                        "entityMap": {},
                        "blocks": [
                            {
                                "key": "46lcr",
                                "text": "Name",
                                "type": "unstyled",
                                "depth": 0,
                                "inlineStyleRanges": [],
                                "entityRanges": [],
                                "data": {}
                            }
                        ]
                    },
                    {
                        "entityMap": {},
                        "blocks": [
                            {
                                "key": "1udmc",
                                "text": "Descriptions",
                                "type": "unstyled",
                                "depth": 0,
                                "inlineStyleRanges": [],
                                "entityRanges": [],
                                "data": {}
                            }
                        ]
                    }
                ],
                "rows": [
                    [
                        {
                            "entityMap": {},
                            "blocks": [
                                {
                                    "key": "7l0ai",
                                    "text": "sdfgsdfgsfg",
                                    "type": "unstyled",
                                    "depth": 0,
                                    "inlineStyleRanges": [],
                                    "entityRanges": [],
                                    "data": {}
                                }
                            ]
                        },
                        {
                            "entityMap": {},
                            "blocks": [
                                {
                                    "key": "bnsuo",
                                    "text": "sdfgsdfgsdfg",
                                    "type": "unstyled",
                                    "depth": 0,
                                    "inlineStyleRanges": [],
                                    "entityRanges": [],
                                    "data": {}
                                }
                            ]
                        }
                    ],
                    [
                        {
                            "entityMap": {},
                            "blocks": [
                                {
                                    "key": "e5kdd",
                                    "text": "fgsdfgdfgdf",
                                    "type": "unstyled",
                                    "depth": 0,
                                    "inlineStyleRanges": [],
                                    "entityRanges": [],
                                    "data": {}
                                }
                            ]
                        },
                        {
                            "entityMap": {},
                            "blocks": [
                                {
                                    "key": "abqd0",
                                    "text": "sdfgsdfgdfg",
                                    "type": "unstyled",
                                    "depth": 0,
                                    "inlineStyleRanges": [],
                                    "entityRanges": [],
                                    "data": {}
                                }
                            ]
                        }
                    ]
                ],
                "numberOfColumns": 2
            }
        }
    },
    "blocks": [
        {
            "key": "a1pgt",
            "text": "CheckboxGroup",
            "type": "header-one",
            "depth": 0,
            "inlineStyleRanges": [],
            "entityRanges": [],
            "data": {}
        },
        {
            "key": "1i0do",
            "text": "CheckboxGroup component provides a dev-friendly way to handle all kinds of checkbox lists:",
            "type": "unstyled",
            "depth": 0,
            "inlineStyleRanges": [],
            "entityRanges": [
                {
                    "offset": 0,
                    "length": 13,
                    "key": 0
                }
            ],
            "data": {}
        },
        {
            "key": "3brf9",
            "text": " ",
            "type": "atomic",
            "depth": 0,
            "inlineStyleRanges": [],
            "entityRanges": [
                {
                    "offset": 0,
                    "length": 1,
                    "key": 1
                }
            ],
            "data": {
                "plugin": "code-block"
            }
        },
        {
            "key": "f1emp",
            "text": " ",
            "type": "atomic",
            "depth": 0,
            "inlineStyleRanges": [],
            "entityRanges": [
                {
                    "offset": 0,
                    "length": 1,
                    "key": 2
                }
            ],
            "data": {
                "plugin": "code-block"
            }
        },
        {
            "key": "e2nj5",
            "text": " ",
            "type": "atomic",
            "depth": 0,
            "inlineStyleRanges": [],
            "entityRanges": [
                {
                    "offset": 0,
                    "length": 1,
                    "key": 3
                }
            ],
            "data": {
                "plugin": "react-sandbox"
            }
        },
        {
            "key": "4uf6p",
            "text": " ",
            "type": "atomic",
            "depth": 0,
            "inlineStyleRanges": [],
            "entityRanges": [
                {
                    "offset": 0,
                    "length": 1,
                    "key": 4
                }
            ],
            "data": {
                "plugin": "react-sandbox"
            }
        },
        {
            "key": "fj0pk",
            "text": " ",
            "type": "atomic",
            "depth": 0,
            "inlineStyleRanges": [],
            "entityRanges": [
                {
                    "offset": 0,
                    "length": 1,
                    "key": 5
                }
            ],
            "data": {
                "plugin": "table"
            }
        },
        {
            "key": "f8kl2",
            "text": "",
            "type": "unstyled",
            "depth": 0,
            "inlineStyleRanges": [],
            "entityRanges": [],
            "data": {}
        },
        {
            "key": "a42uu",
            "text": "",
            "type": "unstyled",
            "depth": 0,
            "inlineStyleRanges": [],
            "entityRanges": [],
            "data": {}
        }
    ]
};