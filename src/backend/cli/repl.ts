// eslint-disable-next-line prettier/prettier
import './dotenv';
import { app, auth, firestoreInstance } from '../firebase';
// eslint-disable-next-line prettier/prettier
import { repos } from '../repositories/repos';
import os from 'os';
import path from 'path';
import repl from 'repl';

interface RegisterFunction {
  (key: string, value: unknown, description: string): void;
}

process.env.NODE_REPL_HISTORY = path.join(os.homedir(), '.node_repl_history');

const help: string[] = [];

const registerVariables = async (register: RegisterFunction) => {
  register('firestoreInstance', firestoreInstance, 'firestore instance object');
  register('app', app, 'firebase app object');
  register('auth', auth, 'firebase auth object');
  register('repos', repos, 'all the repos');
};

const init = async (): Promise<void> => {
  const vars: Record<string, string> = {};

  const replServer = repl.start();

  replServer.on('exit', process.exit);

  const register: RegisterFunction = (key, value, description) => {
    replServer.context[key] = value;
    vars[key] = description;
  };

  register('help', help, 'Help for getting started');
  register('vars', vars, 'all the local vars');

  await registerVariables(register);

  console.log(vars);
  console.log('Start playing around!');
  console.log('Type "help" to see some help');

  replServer.setupHistory(process.env.NODE_REPL_HISTORY!, err => {
    if (err) console.log(err);
  });

  replServer.displayPrompt();
};

init();
