// let protectedInstance;

// export default function getDependerInstance(): InversionOfControl {
//   protectedInstance = !protectedInstance ? new InversionOfControl() : protectedInstance;

//   return protectedInstance;
// }

// export class InversionOfControl {

//   private dependencyIndex: DependencyIndex;

//   constructor() {
//     this.dependencyIndex = {};
//   }

//   public registerIndex(index: any) {
//     this.dependencyIndex = index;
//   }

//   /*
//   public register(key: string, object: any) {

//   }
//   */

//   public resolve(objectKey: string) {

//     return this.dependencyIndex[objectKey];
//   }

// }

// export interface DependencyIndex {
//   [index: string]: any;
// }
