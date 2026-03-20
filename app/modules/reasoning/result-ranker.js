// modules/reasoning/result-ranker.js

class ResultRanker {

finalize(objects){

return objects.map(o=>({

...o,

finalScore:
(o.confidence * 0.5) +
(o.importance * 0.3) +
((o.count || 1) * 0.1) +
(Math.random()*0.1)

}))
.sort((a,b)=>b.finalScore - a.finalScore)

}

}

export default new ResultRanker()
