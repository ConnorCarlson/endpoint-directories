export type DirectoryNode = Map<string, DirectoryNode>;
type DeleteResult = {key: string, node?: DirectoryNode};

/**
   Class to create a new directory
 */
export class Directory {
    parentNode: DirectoryNode;

    constructor() {
        this.parentNode = new Map<string, DirectoryNode>();
    }

    /**
        Finds and returns the node in the directory that corresponds to the given path.
        @param {string[]} path - Array of strings that represent the path to the node.
        @throws {Error} If a key in the path is not found.
        @returns {DirectoryNode} - The node found from the given path.
    */
    public find(path: string[]): DirectoryNode {
        let currentNode: DirectoryNode = this.parentNode;
        for(const key of path) {
            const nextNode = currentNode.get(key);
            if(nextNode) {
                currentNode = nextNode;
            } else {
                throw new Error(`${key} does not exist`);
            }
        }
        return currentNode;
    }

    /**
        Creates a new directory node at the end of the specified path.
        @param {string[]} path - An array of strings representing the path to the directory node to be created.
        @throws {Error} If the path is empty or if a key in the path is not found.
        @returns {void}
    */
    public create(path: string[]) {
        const keyToAdd = path.pop();
        if(!keyToAdd) {
            throw new Error('Invalid Input: Empty path');
        }
        this._addToDirectory(path, keyToAdd, new Map<string, DirectoryNode>());
    }

    /**
        Deletes a node from the directory from the specified path.
        @param {string[]} path - An array of strings representing the path to the directory node to be deleted.
        @throws {Error} If the path is empty or if a key in the path is not found.
        @returns {{string, DirectoryNode}} - The key and value of the node that was deleted.
    */
    public delete(path: string[]): DeleteResult {
        const keyToDelete = path.pop();
        if(!keyToDelete) {
            throw new Error('Invalid Input: Empty path');
        }

        const node = this.find(path);
        const deleted = node.get(keyToDelete);
        node.delete(keyToDelete);
        return {key: keyToDelete, node: deleted};
    }

    /**
        Move a directory node from one location to another within the directory tree.
        @param {string[]} fromPath The path to the node to move.
        @param {string[]} toPath The destination path for the node.
        @throws {Error} If the node to move doesn't exist or if the destination path is invalid.
    */
    public move(fromPath: string[], toPath: string[]) {
        const toMove = this.delete(fromPath);
        const {key, node} = toMove;
        if(node) {
            this._addToDirectory(toPath, key, node);
        } else {
            throw new Error(`${key} does not exist`);
        }
    }

    /**
        Returns a formatted string representation of the directory structure starting from the root node.
        @returns {string} - A string containing the directory structure.
    */
    public list() {
        return this._list('', 0, this.parentNode).trim();
    }

    /**
        A helper function that recursively builds a string representation of the directory structure starting from a given node.
        @param {string} result - The current string representation of the directory structure.
        @param {number} level - The depth of the current node in the directory structure.
        @param {DirectoryNode} - node The current node to build the directory structure string representation from.
        @returns {string} - The updated string representation of the directory structure.
    */
    private _list(result: string, level: number, node?: DirectoryNode) {
        let output = result;
        if(node) {
            for(const key of node.keys()) {
                output += `${' '.repeat(level * 2)}${key}\n`;
                output = this._list(output, level + 1, node.get(key));
            }
        }
        return output;
    }

    /**
        Adds a new key-value pair to a directory node at the specified path.
        @param {string[]} path - The path to the parent directory node.
        @param {string} keyToAdd - The key of the new key-value pair to add to the directory node.
        @param {DirectoryNode} valueToAdd - The value of the new key-value pair to add to the directory node.
        @returns {void}
        @private
    */
    private _addToDirectory(path: string[], keyToAdd: string, valueToAdd: DirectoryNode) {
        const node = this.find(path);
        node.set(keyToAdd, valueToAdd);
        this._sortNode(path, node);
    }

    /**
        Sorts a directory node and updates its parent node with the sorted version.
        @param {string[]} pathToNode - The path to the directory node to be sorted.
        @param {DirectoryNode} node - The directory node to be sorted.
        @returns {void}
        @private
    */
    private _sortNode(pathToNode: string[], node: DirectoryNode) {
        const sorted = new Map([...node.entries()].sort());

        const pointerToSortedNode = pathToNode.pop();
        if(pointerToSortedNode) {
            const prevNode = this.find(pathToNode);
            prevNode.set(pointerToSortedNode, sorted);
        } else {
            this.parentNode = sorted;
        }
    }

}