randInt = (min, max) ->
  min + Math.floor Math.random() * (max - min + 1)

randIntArray = (min, max, count) ->
  while count--
    randInt min, max

dbURL = "https://examination.firebaseio.com/"

singleCounts = 80
multisCounts = 10

ifm = $("[name='mainm']").contents()

prompts = []

class fetchRequest

  constructor: (@ref, @name) ->
    
  fetchCallback: (snap) =>
    ans = snap.val()
    console.log "Fetching #{@name}"
    if ans != null
      fillForm @name, ans
    else
      console.log "#{name} no answer"
      prompts.push name

  exec: ->
    @ref.once "value", @fetchCallback

class pushRequest

  constructor: (@ref, @answer) ->
  
  pushCallback: (snap) =>
    ans = snap.val()
    unless ans
      @ref.set(@answer)

  exec: ->
    @ref.once "value", @pushCallback

fillForm = (name, answer) ->
  console.log "Filling #{name} with #{answer}"
  if typeof answer == "number"
    # Single answer
    answer = [answer]
  ifm.find("[name='#{name}']").get(ans).checked = true for ans in answer
  return

getSingleQuestion = ->
  ifm.find("[name='s_an[#{q}]']").next().next().next().html()\
    .replace(/\uff08<fon.+\uff09/, "").replace(/\n\r]/, "")\
    .replace(/<(\w).*>.+<\/\1>/, "").replace(/[.#$\[\]]/, "").slice(0,102)\
    for q in [1..singleCounts]

getMultisQuestion = ->
  ifm.find("[name='m_an[#{q}]']").next().next().next().html()\
    .replace(/\uff08<fon.+\uff09/, "").replace(/\n\r]/, "")\
    .replace(/<(\w).*>.+<\/\1>/, "").replace(/[.#$\[\]]/, "").slice(0,102)\
    for q in [1..multisCounts]

getName = (mode, id) ->
  if mode == "single"
    "single_answer[#{id}]"
  else
    "more_answer[#{id}]"

answerSingle = (queSet, ansSet) ->
  for i in [0..ansSet.length - 1]
    ifm.find("[name='single_answer[#{i+1}]']").get(ansSet[i]).checked = true
  return

answerMultis = (queSet, ansSet) ->
  for i in [0..ansSet.length - 1]
    ifm.find("[name='more_answer[#{i+1}]']").get(q).checked = true for q in ansSet[i]
  return

fetchAnswer = (mode, qSet) ->
  # Mode must be single or multis
  dbRef = new Firebase dbURL + mode + '/'
  reqQueue = []
  for i in [0..qSet.length - 1]
    reqQueue.push new fetchRequest dbRef.child(escape(qSet[i])), getName(mode, i+1)
  for req in reqQueue
    req.exec()
  return

pushAnswer = (mode, qSet, aSet) ->
  # Mode must be single or multis
  dbRef = new Firebase dbURL + mode + '/'
  pushQueue = []
  for i in [0..qSet.length - 1]
    if aSet[i] != null
      console.log "Pushing #{aSet[i]}"
      ref = dbRef.child escape qSet[i]
      pushQueue.push new pushRequest(ref, aSet[i])
    else
      console.log "Ignoring #{aSet[i]} in #{qSet[i]}"
      continue
  for push in pushQueue
    push.exec()
  return

getAnswerSingle = ->
  for i in [1..singleCounts]
    # get index offset to A
    ans = ifm.find("[name='single_answer[#{i}]']:checked").val()
    if ans
      ans.charCodeAt(0) - 65
    else
      prompts.push "single_answer[#{i}]"
      null

getAnswerMultis = ->
  ansSet =\
  for i in [1..multisCounts]
    # get index offset to A
    ansCell = []
    ifm.find("[name='more_answer[#{i}]']:checked").each (index, value) ->
      ansCell.push value.value.charCodeAt(0) - 65
    if ansCell.length == 0
      prompts.push "multis_answer[#{i}]"
      null
    else
      ansCell
  console.log(ansSet)
  return ansSet

single = getSingleQuestion()
multis = getMultisQuestion()

alert "Please be patient while uploading answers."
# unless confirm "\u662f\u5426\u63d0\u4ea4\u7b54\u6848\uff1f"
# fetchAnswer "single", single
# fetchAnswer "multis", multis
# else
singleAns = getAnswerSingle()
multisAns = getAnswerMultis()
pushAnswer "single", single, singleAns
pushAnswer "multis", multis, multisAns
setTimeout ->
  if prompts.length != 0
    alert "There are questions have no answer chosen. They are:\n#{prompts.join "\n"}"
, 3000

# console.log getSingle()
# console.log getMultis()
# answerSingle getSingleQuestion(), randIntArray 0, 3, singleCounts
# answerMultis getMultisQuestion(), [
#   [0,1],[2,3],[1,2,3],[0,1,3],[2,3],[2,3],[1,2,3],[0,1],[0,1,2],[0,2,3]]
