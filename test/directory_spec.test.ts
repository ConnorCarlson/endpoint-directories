import { Directory, DirectoryNode } from "../src/Directory";

describe('directory tests', () => {
    let directory: Directory;
    beforeEach(() => {
        directory = new Directory();
        directory.parentNode.set('fruits', new Map<string, DirectoryNode>(
            [
                ['apples', new Map<string, DirectoryNode>([
                    ['fuji', new Map<string, DirectoryNode>()],
                    ['honeycrisps', new Map<string, DirectoryNode>()]
                ])]
            ]));
        directory.parentNode.set('grains', new Map<string, DirectoryNode>());
        directory.parentNode.set('vegetables', new Map<string, DirectoryNode>());
    });

    describe('find tests', () => {
        it('can find a node', () => {
            const result = directory.find(['fruits', 'apples']);
            expect(result).toBeTruthy();
            expect(Array.from(result!.keys())).toEqual(['fuji', 'honeycrisps']);
        });

        it('throws an error if the path is not found', () => {
            expect(() => directory.find(['fruits', 'banana', 'asparagus'])).toThrowError('banana does not exist');
        });
    });

    describe('list tests', () => {
        it('can list the directory', () => {
            const result = directory.list();
            expect(result).toEqual(`fruits\n  apples\n    fuji\n    honeycrisps\ngrains\nvegetables`);
        });
    });

    describe('delete tests', () => {
        it('deletes a value from the directory', () => {
            const result = directory.delete(['fruits', 'apples', 'fuji']);
            expect(result).toEqual({key: 'fuji', node: new Map<string, DirectoryNode>()});
            const list = directory.list();
            expect(list).toEqual(`fruits\n  apples\n    honeycrisps\ngrains\nvegetables`);
        });

        it('throws an error if the path is not found', () => {
            expect(() => directory.create(['fruits', 'banana', 'asparagus'])).toThrowError('banana does not exist');
        });
    })

    describe('create tests', () => {
        it('creates a new entry in a directory and sorts it', () => {
            directory.create(['fruits', 'apples', 'granny smith']);
            const result = directory.list();
            expect(result).toEqual(`fruits\n  apples\n    fuji\n    granny smith\n    honeycrisps\ngrains\nvegetables`);
        });

        it('creates a new entry at the top level and sorts it', () => {
            directory.create(['meat']);
            const result = directory.list();
            expect(result).toEqual(`fruits\n  apples\n    fuji\n    honeycrisps\ngrains\nmeat\nvegetables`);
        });

        it('throws an error if the path to move is empty', () => {
            expect(() => directory.create([])).toThrowError('Invalid Input: Empty path');
        });

        it('throws an error if the path is not found', () => {
            expect(() => directory.create(['fruits', 'banana', 'asparagus'])).toThrowError('banana does not exist');
        });
    })

    describe('move tests', () => {
        it('moves nodes and sorts them', () => {
            directory.create(['fruits', 'apples', 'asparagus']);
            directory.create(['fruits', 'apples', 'broccoli']);
            directory.move(['fruits', 'apples', 'broccoli'], ['vegetables']);
            directory.move(['fruits', 'apples', 'asparagus'], ['vegetables']);
            const result = directory.list();
            expect(result).toEqual(`fruits\n  apples\n    fuji\n    honeycrisps\ngrains\nvegetables\n  asparagus\n  broccoli`);
        });

        it('moves nodes to the top level of the directory', () => {
            directory.create(['fruits', 'apples', 'meat']);
            directory.move(['fruits', 'apples', 'meat'], []);
            const result = directory.list();
            expect(result).toEqual(`fruits\n  apples\n    fuji\n    honeycrisps\ngrains\nmeat\nvegetables`);
        });

        it('throws an error if the path to move is empty', () => {
            expect(() => directory.move([], [])).toThrowError('Invalid Input: Empty path');
        });

        it('throws an error if the path is not found', () => {
            expect(() => directory.move(['fruits', 'banana', 'asparagus'], [])).toThrowError('banana does not exist');
        });
    });

});