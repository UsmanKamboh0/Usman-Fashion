class ApiFeature {
    constructor(query, querystr) {
        this.query = query;
        this.querystr = querystr;
    }
    //   queryStr =these things that display after after? i.e  http://localhost:4000/api/v1/products?price(gte)=2500&price(lte)=3000
    search() {
        const keyword = this.querystr.keyword
            ? {
                name: {
                    $regex: this.querystr.keyword,
                    $options: "i",
                },
            }
            : {};

        // this.query is the product find method that call from productcontroller
        this.query = this.query.find({ ...keyword });
        return this;
    }
    filter() {
        const queryCopy = { ...this.querystr };
        // console.log(queryCopy)
        const removeFields = ["keyword", "page", "limit"];

        removeFields.forEach((key) => delete queryCopy[key]);
        // console.log(queryCopy)
        let queryStr = JSON.stringify(queryCopy);
        // add $ with gt gte Ite It 
        queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (key) => `$${key}`);

        // this.query is the product find method that call from productcontroller
        this.query = this.query.find(JSON.parse(queryStr));
        // console.log(queryStr)

        return this;

    }
     filter() {
        const queryCopy = { ...this.querystr };
        // console.log(queryCopy)
        const removeFields = ["keyword", "page", "limit"];

        removeFields.forEach((key) => delete queryCopy[key]);
        // console.log(queryCopy)
        let queryStr = JSON.stringify(queryCopy);
        // add $ with gt gte Ite It 
        queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (key) => `$${key}`);

        // this.query is the product find method that call from productcontroller
        this.query = this.query.find(JSON.parse(queryStr));
        // console.log(queryStr)

        return this;

    }
    pagination(resultPerPage){
// Number is use to convert string into Number
        const currentpage =Number(this.querystr.page) || 1;
        // resultperpage=10 current page =1
        // 10*(1-1);
        // 10(0)=0 not skip any product
        const skip =resultPerPage * (currentpage -1);
        // this.query is the product find method that call from productcontroller
        this.query =this.query.limit(resultPerPage).skip(skip);
        return this;

    }

    










}
module.exports = ApiFeature