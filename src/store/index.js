const toml = require('toml');
const os = require('os');
const fs = require('fs');
const Trello = require('node-trello');

const apiKey = '82ed0acc1619df728a91809d5961de70';

const homeDirectory = os.homedir();
const configFile = `${homeDirectory}/.config/termello/config`;
let TrelloConnection = null;
TrelloConnection = null;

const TrelloSetup = (token) => {
  if (TrelloConnection === null && token !== null) {
    TrelloConnection = new Trello(apiKey, token);
  }
  return TrelloConnection !== null;
};

export default {
  state: {
    token: null,
    boards: [],
    viewingBoard: null,
    viewingCard: null,
    notifications: [],
  },
  mutations: {
    setToken(state, v) {
      state.token = v;
    },
    setBoards(state, b) {
      state.boards = b;
    },
    setBoardView(state, b) {
      state.viewingBoard = b;
    },
    setCardView(state, b) {
      state.viewingCard = b;
    },
    setNotifications(state, n) {
      state.notifications = n;
    },
  },
  actions: {
    getToken(context) {
      return new Promise((resolve, reject) => {
        let config = null;
        if (fs.existsSync(configFile)) {
          config = toml.parse(fs.readFileSync(configFile));
          context.commit('setToken', config.trello.token);
          resolve();
        } else {
          if (!fs.existsSync(`${homeDirectory}/.config`)) {
            fs.mkdirSync(`${homeDirectory}/.config`);
          }
          if (!fs.existsSync(`${homeDirectory}/.config/termello`)) {
            fs.mkdirSync(`${homeDirectory}/.config/termello`);
          }
        }
        reject();
      });
    },
    updateBoards(context) {
      if (TrelloSetup(context.state.token)) {
        return new Promise((resolve, reject) => {
          TrelloConnection.get('/1/members/me/boards', null, (err, data) => {
            if (err) {
              reject(err);
            }
            context.commit('setBoards', data);
            resolve();
          });
        });
      }
      return Promise.reject();
    },
    refreshNotifications(context) {
      if (TrelloSetup(context.state.token)) {
        return new Promise((resolve, reject) => {
          TrelloConnection.get('/1/members/me/notifications', null, (err, data) => {
            if (err) {
              reject(err);
            }
            context.commit('setNotifications', data);
            resolve();
          });
        });
      }
      return Promise.reject();
    },
  },
};
