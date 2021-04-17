export enum Action {
  TakesAShot = 'takes a shot',
  TakesAShotOnTarget = 'takes a shot on target',
  ScoresAGoal = 'scores a goal',
  AssistsAGoal = 'assists a goal',
  MakesASave = 'makes a save',
  PlaysAKeyPass = 'plays a key pass',
  MakesATackle = 'makes a tackle',
  BlocksAShot = 'blocks a shot',
  InterceptsAPass = 'intercepts a pass',
  DribblesPastAPlayer = 'dribbles past a player',
  CommitsAFoul = 'commits a foul',
  DrawsAFoul = 'draws a foul',
  ReceivesAYellowCard = 'receives a yellow card',
  ReceivesARedCard = 'receives a red card',
  WinsOrScoresAPenalty = 'wins or scores a penalty',
  ConcedesAPenalty = 'concedes a penalty',
}

export const actionsToPoints = {
  [Action.TakesAShot]: 3,
  [Action.TakesAShotOnTarget]: 4,
  [Action.ScoresAGoal]: 8,
  [Action.AssistsAGoal]: 6,
  [Action.MakesASave]: 1,
  [Action.PlaysAKeyPass]: 3,
  [Action.MakesATackle]: 2,
  [Action.BlocksAShot]: 3,
  [Action.InterceptsAPass]: 3,
  [Action.DribblesPastAPlayer]: 4,
  [Action.CommitsAFoul]: 2,
  [Action.DrawsAFoul]: 3,
  [Action.ReceivesAYellowCard]: 3,
  [Action.ReceivesARedCard]: 8,
  [Action.WinsOrScoresAPenalty]: 6,
  [Action.ConcedesAPenalty]: 8,
};

export const actions: Action[] = [
  // first 11
  Action.MakesASave,
  Action.ConcedesAPenalty,
  Action.ReceivesARedCard,
  Action.CommitsAFoul,
  Action.MakesATackle,
  Action.InterceptsAPass,
  Action.PlaysAKeyPass,
  Action.MakesATackle,
  Action.BlocksAShot,
  Action.ReceivesAYellowCard,
  Action.TakesAShot,
  // next 11
  Action.MakesASave,
  Action.ConcedesAPenalty,
  Action.BlocksAShot,
  Action.ReceivesAYellowCard,
  Action.AssistsAGoal,
  Action.DrawsAFoul,
  Action.ScoresAGoal,
  Action.WinsOrScoresAPenalty,
  Action.MakesATackle,
  Action.DribblesPastAPlayer,
  Action.TakesAShotOnTarget,
];