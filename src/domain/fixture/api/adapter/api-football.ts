import dayjs from 'dayjs';
import { FOOTBALL_API_KEY, IS_PROD_ENV } from '../../../../config';
import makeRequest from '../../../../services/request';
import { generateEvents } from '../../../event/services/eventGenerator';
import { FootballPlayer } from '../../data/Fixture';
import { GetFixture, GetFixtures } from '../indexBackend';
import { idsOfLeaguesWeWatch } from './apiFootballLeagues';
import { mockFixturesData } from './mockApiFootballData/fixtures';
import {
  ApiFootballFixture,
  ApiFootballLineups,
  ApiFootballPlayer,
  mockPastFixture,
} from './mockApiFootballData/pastFixture';

const makeRequestToApiFootball = async ({
  method,
  path,
  params,
}: {
  method: string;
  path: string;
  params?: unknown;
}) => {
  const res = await makeRequest({
    method,
    url: `https://v3.football.api-sports.io/${path}`,
    params,
    headers: {
      'x-rapidapi-key': FOOTBALL_API_KEY,
      'x-rapidapi-host': 'v3.football.api-sports.io',
    },
  });
  return res.response;
};

// https://www.api-football.com/documentation-v3#operation/get-fixtures
const getFixtureFromApiFootball = async (
  fixtureId: string
): Promise<ApiFootballFixture> => {
  const fixtures = await makeRequestToApiFootball({
    method: 'GET',
    path: 'fixtures',
    params: { id: fixtureId },
  });
  return fixtures[0];
};

const actions = [
  // first 11
  'makes a save',
  'concedes a penalty',
  'receives a red card',
  'commits a foul',
  'is substituted on or off',
  'intercepts a pass',
  'plays a key pass',
  'makes a tackle',
  'blocks a shot',
  'receives a yellow card',
  'takes a shot',
  // next 11
  'makes a save',
  'concedes a penalty',
  'dribbles past a player',
  'takes a shot on target',
  'assists a goal',
  'draws a foul',
  'scores a goal',
  'wins or scores a penalty',
  'makes a tackle',
  'blocks a shot',
  'receives a yellow card',
];

const extractPlayerNamesFromLineups = (
  lineups: ApiFootballLineups
): string[] => {
  if (!lineups.length) {
    return [];
  }
  const [homeLineupData, awayLineupData] = lineups;
  const homePlayers = homeLineupData.startXI;
  const awayPlayers = awayLineupData.startXI;
  const playersData = [...homePlayers, ...awayPlayers];
  const playerNames = playersData.map(({ player: { name } }) => name);
  return playerNames;
};

const extractPlayer = ({ player }: ApiFootballPlayer): FootballPlayer => ({
  name: player.name,
  imageUrl: player.photo,
});

const extractPlayers = (fixtureData: ApiFootballFixture): FootballPlayer[] => {
  const { lineups, players } = fixtureData;
  if (!lineups.length) {
    return [];
  }
  const namesOfPlayersInLineup = extractPlayerNamesFromLineups(lineups);
  const [{ players: homePlayers }, { players: awayPlayers }] = players;
  const playersData = [
    ...homePlayers.map(extractPlayer),
    ...awayPlayers.map(extractPlayer),
  ];
  return playersData.filter((player) =>
    namesOfPlayersInLineup.includes(player.name)
  );
};

export const getFixture: GetFixture = async (fixtureId) => {
  const fixtureData: ApiFootballFixture = IS_PROD_ENV
    ? await getFixtureFromApiFootball(fixtureId)
    : mockPastFixture;

  const {
    teams: { home, away },
  } = fixtureData;

  const players = extractPlayers(fixtureData);
  const events = generateEvents(players, actions);

  return {
    id: fixtureId,
    homeTeamName: home.name,
    awayTeamName: away.name,
    homeTeamLogo: home.logo,
    awayTeamLogo: away.logo,
    events,
  };
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getLeaguePreviews = async () => {
  const data = await makeRequestToApiFootball({
    method: 'GET',
    path: 'leagues',
    params: {
      current: 'true',
    },
  });
  return data.map(({ league: { id, name }, country }) => ({
    id,
    name,
    country: country.name,
  }));
};

// https://www.api-football.com/documentation-v3#operation/get-fixtures
export const getFixtures: GetFixtures = async () => {
  const data = IS_PROD_ENV
    ? await makeRequestToApiFootball({
        method: 'GET',
        path: 'fixtures',
        params: {
          date: dayjs().format('YYYY-MM-DD'),
          season: 2020,
          timezone: 'Europe/London',
        },
      })
    : mockFixturesData;
  return data
    .filter(({ league }) => idsOfLeaguesWeWatch.includes(league.id))
    .map(({ fixture, teams }) => ({
      id: `${fixture.id}`,
      homeTeamName: teams.home.name,
      awayTeamName: teams.away.name,
      homeTeamLogo: teams.home.logo,
      awayTeamLogo: teams.away.logo,
    }));
};
