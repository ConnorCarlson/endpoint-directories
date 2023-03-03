import * as fs from 'fs';
import { Directory } from './Directory';

// Valid command types
enum Actions {
    CREATE = 'CREATE',
    MOVE = 'MOVE',
    DELETE = 'DELETE',
    LIST = 'LIST'
}

/**
   Class to create a new Executer that runs the commands from a text
   file.
 */
export class Executer {
    directory: Directory;
    constructor() {
        this.directory = new Directory();
    }

    /**
        Reads a text file and executes each command in the file.
        @param {string} file - The path of the file to read.
    */
    public readAndExecuteInput(file: string) {
        const parsedTextFile = fs.readFileSync(file, 'utf-8');
        const parsedTextFileArray = parsedTextFile.split('\n');

        for(const command of parsedTextFileArray) {
            this._execute(command);
        }
    }
    
    /**
        Executes a single command on the directory.
        @param {string} command - The command to execute.
        @throws {Error} if the command is not valid.
     */
    private _execute(command: string) {
        const commandSplit = command.split(' ');
        const action = commandSplit[0];
        if(!(<any>Object).values(Actions).includes(action)) {
            throw new Error('Invalid Command');
        }
        console.log(command);
        switch(action) {
            case Actions.CREATE:
                const pathToCreate = commandSplit[1];
                try {
                    this.directory.create(pathToCreate.split('/'));
                } catch (error: any) {
                    console.log(`Cannot create ${pathToCreate} - ${error.message}`);
                }
                break;
            case Actions.DELETE:
                const pathToDelete = commandSplit[1];
                try {
                    this.directory.delete(pathToDelete.split('/'));
                } catch (error: any) {
                    console.log(`Cannot delete ${pathToDelete} - ${error.message}`);
                }
                break;
            case Actions.MOVE:
                const pathMoveFrom = commandSplit[1];
                const pathMoveTo = commandSplit[2];
                try {
                    this.directory.move(pathMoveFrom.split('/'), pathMoveTo.split('/'));
                } catch (error: any) {
                    console.log(`Cannot move ${pathMoveFrom} - ${error.message}`);
                }
                break;
            case Actions.LIST:
                console.log(this.directory.list());
                break;
        }
    }
}
