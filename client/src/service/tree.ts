export class TreeNode {
    value: string;
    left: TreeNode | null;
    right: TreeNode | null;
  
    constructor(value: string) {
      this.value = value;
      this.left = null;
      this.right = null;
    }
  }
  
  class BinaryTree {
    root: TreeNode | null;
  
    constructor() {
      this.root = null;
    }
  
    insert(value: string): void {
      const newNode = new TreeNode(value);
  
      if (this.root === null) {
        this.root = newNode;
      } else {
        this.insertNode(this.root, newNode);
      }
    }
  
    private insertNode(node: TreeNode, newNode: TreeNode): void {
      if (newNode.value < node.value) {
        if (node.left === null) {
          node.left = newNode;
        } else {
          this.insertNode(node.left, newNode);
        }
      } else {
        if (node.right === null) {
          node.right = newNode;
        } else {
          this.insertNode(node.right, newNode);
        }
      }
    }
  
    search(value: string): boolean {
      return this.searchNode(this.root, value);
    }
  
    private searchNode(node: TreeNode | null, value: string): boolean {
      if (node === null) {
        return false;
      }
  
      if (value < node.value) {
        return this.searchNode(node.left, value);
      } else if (value > node.value) {
        return this.searchNode(node.right, value);
      } else {
        return true;
      }
    }
  }
  

//   const result = string1.localeCompare(string2);

// if (result < 0) {
//   console.log(`${string1} comes before ${string2}`);
// } else if (result > 0) {
//   console.log(`${string2} comes before ${string1}`);
// } else {
//   console.log(`${string1} and ${string2} are equal`);
// }
