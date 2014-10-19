var data = angular.module('akrDataService', ['scope', 'http']);

data.service('dataService', function($http) {
    this.kana1 = $http({
        method: "GET",
        url: "../../data/kana/json/kana_1.json"
    });

    this.kana2 = $http({
        method: "GET",
        url: "../../data/kana/json/kana_2.json"
    });

    this.n5Vocab = $http({
        method: "GET",
        url: "../../data/totaln5/vocab/json/n5vocab.json"
    });

    this.n5Grammar1 = $http({
        method: "GET",
        url: "../../data/totaln5/grammar/json/type1.json"
    });

    this.n5Grammar2 = $http({
        method: "GET",
        url: "../../data/totaln5/grammar/json/type2.json"
    });

    this.n5Grammar3 = $http({
        method: "GET",
        url: "../../data/totaln5/grammar/json/type3.json"
    });

    this.n5Grammar4 = $http({
        method: "GET",
        url: "../../data/totaln5/grammar/json/type4.json"
    });

    this.n5Grammar5 = $http({
        method: "GET",
        url: "../../data/totaln5/grammar/json/type5.json"
    });

    this.n4Vocab = $http({
        method: "GET",
        url: "../../data/totaln4/vocab/json/n4vocab.json"
    });

    this.n4Grammar1 = $http({
        method: "GET",
        url: "../../data/totaln4/grammar/json/type1.json"
    });

    this.n4Grammar2 = $http({
        method: "GET",
        url: "../../data/totaln4/grammar/json/type2.json"
    });

    this.n4Grammar3 = $http({
        method: "GET",
        url: "../../data/totaln4/grammar/json/type3.json"
    });

    this.n4Grammar4 = $http({
        method: "GET",
        url: "../../data/totaln4/grammar/json/type4.json"
    });

    this.n4Grammar5 = $http({
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

    /*==================================
    =            N4-Grammar            =
    ==================================*/

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

    /*===============================
    =            N4-Read            =
    ===============================*/

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

    /*-----  End of N4 data  ------*/


    /*===============================
    =            N5 data            =
    ===============================*/
    /*=================================
    =            N4- vocab            =
    =================================*/

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

    /*==================================
    =            n5-Grammar            =
    ==================================*/

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

    /*===============================
    =            n5-Read            =
    ===============================*/

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

});
