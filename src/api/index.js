import http from '../services/index'
import pathUrl from './pathUrl'

//获取活动时间
export const getResourceDetail = (query) => {
  return http.get(pathUrl.userVerify, query)
}

//获取当前时间
export const getcurrentTime = (query) => {
  return http.post(pathUrl.getNowDate, query)
}

//获取用戶信息
export const getUserInfo = (query) => {
  return http.post(pathUrl.queryUserInfo, query, false)
}

//活动一获取个人主页活动信息
export const getActivityOneUserInfo = (query) => {
  return http.post(pathUrl.activityOneUserInfo, query, false)
}

//进入答题
export const getAnswer = (query) => {
  return http.post(pathUrl.startAnswer, query, false)
}

//next 答题
export const getNextQuestion = (query) => {
  return http.post(pathUrl.nextQuestion, query, false)
}

//活动二获取个人主页活动信息
export const getActivityTwoUserInfo = (query) => {
  return http.get(pathUrl.activityTwoUserInfo, query)
}

//活动一的获奖排名
export const getActivityOneAward = (query) => {
  return http.post(pathUrl.activityOneAward, query, false)
}

//活动二的获奖排名
export const getActivityTwoAward = (query) => {
  return http.get(pathUrl.activityTwoAward, query)
}

//幸运排名
export const getRandomRank = (query) => {
  return http.get(pathUrl.randomRank, query )
}

