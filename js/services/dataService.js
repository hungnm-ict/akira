var data = angular.module('akrDataService', []);

data.service('dataService', function($http) {
    this.kana1 = $http({
        method: "GET",
        url: "../../data/kana/json/kana_1.json"
    });

    this.kana2 = $http({
        method: "GET",
        url: "../../data/kana/json/kana_2.json"
    });

    this.n5TotalVocab = $http({
        method: "GET",
        url: "../../data/totaln5/vocab/json/n5vocab.json"
    });

    this.n5TotalGrammar1 = $http({
        method: "GET",
        url: "../../data/totaln5/grammar/json/type1.json"
    });

    this.n5TotalGrammar2 = $http({
        method: "GET",
        url: "../../data/totaln5/grammar/json/type2.json"
    });

    this.n5TotalGrammar3 = $http({
        method: "GET",
        url: "../../data/totaln5/grammar/json/type3.json"
    });

    this.n5TotalGrammar4 = $http({
        method: "GET",
        url: "../../data/totaln5/grammar/json/type4.json"
    });

    this.n5TotalGrammar5 = $http({
        method: "GET",
        url: "../../data/totaln5/grammar/json/type5.json"
    });

    this.n4TotalVocab = $http({
        method: "GET",
        url: "../../data/totaln4/vocab/json/n4vocab.json"
    });

    this.n4TotalGrammar1 = $http({
        method: "GET",
        url: "../../data/totaln4/grammar/json/type1.json"
    });

    this.n4TotalGrammar2 = $http({
        method: "GET",
        url: "../../data/totaln4/grammar/json/type2.json"
    });

    this.n4TotalGrammar3 = $http({
        method: "GET",
        url: "../../data/totaln4/grammar/json/type3.json"
    });

    this.n4TotalGrammar4 = $http({
        method: "GET",
        url: "../../data/totaln4/grammar/json/type4.json"
    });

    this.n4TotalGrammar5 = $http({
        method: "GET",
        url: "../../data/totaln4/grammar/json/type5.json"
    });

    this.n4Kanji = $http({
        method: "GET",
        url: "../../data/kanjin4/json/n4kanji.json"
    });

    this.n5Kanji = $http({
        method: "GET",
        url: "../../data/kanjin5/json/n5kanji.json"
    });


    this.n4vocab1 = $http({
        method: "GET",
        url: "../../data/testn4/json/vocab_1.json"
    });

    this.n4vocab2 = $http({
        method: "GET",
        url: "../../data/testn4/json/vocab_2.json"
    });

    this.n4vocab3 = $http({
        method: "GET",
        url: "../../data/testn4/json/vocab_3.json"
    });

    this.n4vocab4 = $http({
        method: "GET",
        url: "../../data/testn4/json/vocab_4.json"
    });

    this.n4grammar1 = $http({
        method: "GET",
        url: "../../data/testn4/json/grammar_1.json"
    });

    this.n4grammar2 = $http({
        method: "GET",
        url: "../../data/testn4/json/grammar_2.json"
    });

    this.n4grammar3 = $http({
        method: "GET",
        url: "../../data/testn4/json/grammar_3.json"
    });

    this.n4grammar4 = $http({
        method: "GET",
        url: "../../data/testn4/json/grammar_4.json"
    });

    this.n4read1 = $http({
        method: "GET",
        url: "../../data/testn4/json/read_1.json"
    });

    this.n4read2 = $http({
        method: "GET",
        url: "../../data/testn4/json/read_2.json"
    });

    this.n4read3 = $http({
        method: "GET",
        url: "../../data/testn4/json/read_3.json"
    });

    this.n4read4 = $http({
        method: "GET",
        url: "../../data/testn4/json/read_4.json"
    });

    this.n4write1 = $http({
        method: "GET",
        url: "../../data/testn4/json/write_1.json"
    });

    this.n4write2 = $http({
        method: "GET",
        url: "../../data/testn4/json/write_2.json"
    });

    this.n4write3 = $http({
        method: "GET",
        url: "../../data/testn4/json/write_3.json"
    });

    this.n4write4 = $http({
        method: "GET",
        url: "../../data/testn4/json/write_4.json"
    });

    this.n5vocab1 = $http({
        method: "GET",
        url: "../../data/testn5/json/vocab_1.json "
    });

    this.n5vocab2 = $http({
        method: "GET",
        url: "../../data/testn5/json/vocab_2.json"
    });

    this.n5vocab3 = $http({
        method: "GET",
        url: "../../data/testn5/json/vocab_3.json"
    });

    this.n5vocab4 = $http({
        method: "GET",
        url: "../../data/testn5/json/vocab_4.json"
    });

    this.n5grammar1 = $http({
        method: "GET",
        url: "../../data/testn5/json/grammar_1.json"
    });

    this.n5grammar2 = $http({
        method: "GET",
        url: "../../data/testn5/json/grammar_2.json"
    });

    this.n5grammar3 = $http({
        method: "GET",
        url: "../../data/testn5/json/grammar_3.json"
    });

    this.n5grammar4 = $http({
        method: "GET",
        url: "../../data/testn5/json/grammar_4.json"
    });

    this.n5read1 = $http({
        method: "GET",
        url: "../../data/testn5/json/read_1.json"
    });

    this.n5read2 = $http({
        method: "GET",
        url: "../../data/testn5/json/read_2.json"
    });

    this.n5read3 = $http({
        method: "GET",
        url: "../../data/testn5/json/read_3.json"
    });

    this.n5read4 = $http({
        method: "GET",
        url: "../../data/testn5/json/read_4.json"
    });

    this.n5write1 = $http({
        method: "GET",
        url: "../../data/testn5/json/write_1.json"
    });

    this.n5write2 = $http({
        method: "GET",
        url: "../../data/testn5/json/write_2.json"
    });

    this.n5write3 = $http({
        method: "GET",
        url: "../../data/testn5/json/write_3.json"
    });

    this.n5write4 = $http({
        method: "GET",
        url: "../../data/testn5/json/write_4.json"
    });

    this.getDataPromises = function(degree, course, lessonId, subId, skill) {
        switch (degree) {
            case "n5":
                switch (course) {
                    case "kana":
                        switch (lessonId) {
                            case "1":
                            case "3":
                                return this.kana1;
                                break;
                            case "2":
                            case "4":
                                return this.kana2;
                                break;
                            default:
                                return null;
                                break;
                        }
                        break;
                    case "total":
                        switch (subId) {
                            case "1":
                            case "2":
                            case "3":
                                return this.n5TotalVocab;
                                break;
                            case "4":
                                switch (skill) {
                                    case "1":
                                        return this.n5TotalGrammar1;
                                        break;
                                    case "2":
                                        return this.n5TotalGrammar2;
                                        break;
                                    case "3":
                                        return this.n5TotalGrammar3
                                        break;
                                    case "4":
                                        return this.n5TotalGrammar4;
                                        break;
                                    case "5":
                                        return this.n5TotalGrammar5;
                                        break;
                                    default:
                                        return null;
                                        break;
                                }
                                break;
                            default:
                                return null;
                                break;
                        }
                        break;
                    case "kanji":
                        return this.kanjin5;
                        break;
                    case "test":
                        //This one is a little bit complex
                        return null;
                        break;
                    default:
                        return null;
                        break;
                }
                break;
            case "n4":
                switch (course) {
                    case "total":
                        switch (subId) {
                            case "1":
                            case "2":
                            case "3":
                                return this.n4TotalVocab;
                                break;
                            case "4":
                                switch (skill) {
                                    case "1":
                                        return this.n4TotalGrammar1;
                                        break;
                                    case "2":
                                        return this.n4TotalGrammar2;
                                        break;
                                    case "3":
                                        return this.n4TotalGrammar3
                                        break;
                                    case "4":
                                        return this.n4TotalGrammar4;
                                        break;
                                    case "5":
                                        return this.n4TotalGrammar5;
                                        break;
                                    default:
                                        return null;
                                        break;
                                }
                                break;
                            default:
                                return null;
                                break;
                        }
                        break;
                    case "kanji":
                        return this.kanjin4;
                        break;
                    case "test":
                        //This one is a little bit complex
                        return null;
                        break;
                    default:
                        return null;
                        break;
                }
                break;
            case "n3":
                return null;
                break;
            case "n2":
                return null;
                break;
            case "n1":
                return null;
                break;
            default:
                return null;
                break;
        }
    }
});
