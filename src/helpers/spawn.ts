import { spawn }  from 'node:child_process';

export const execute = (
  command: string,
  args: string[],
  options: any
) =>
  new Promise((resolve, reject) => {
    let result: string = '';
    const child = spawn(command, args, options);

    child.on('exit', () => resolve(result));

    child.stdout.on('data', (data) => {
      result += data.toString();
    });

    child.on('close',
      (code) => (code === 0)
        ? resolve(result) : reject('failed'));
  });
