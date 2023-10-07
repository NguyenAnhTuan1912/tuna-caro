import ModelBase from "./base";

import PostData from "./post.json";

export default class PostModel extends ModelBase {
  async find(query: any) {
    return PostData.find(data => data.id === query);
  }

  async findMultiple(query: any) {
    let N = PostData.length;
    let skip = query.skip ? query.skip : 0;
    let limit = query.limit ? query.limit : 5;

    let result = [];

    // console.log("Limit ~ file db/post.js ~ line:17: ", limit);
    // console.log("Skip ~ file db/post.js ~ line:18: ", skip);

    if(skip > N - 1) skip = N - limit;

    for(let i = skip; i < skip + limit; i++) {
      result.push(PostData[i]);
    }

    return result;
  }
}