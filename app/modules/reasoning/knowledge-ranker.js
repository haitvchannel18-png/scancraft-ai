// modules/reasoning/knowledge-ranker.js

class KnowledgeRanker {

rank(knowledge){

return knowledge.sort((a,b)=>{

const scoreA = (a.confidence * 0.6) + (a.importance * 0.4)
const scoreB = (b.confidence * 0.6) + (b.importance * 0.4)

return scoreB - scoreA

})

}

}

export default new KnowledgeRanker()
