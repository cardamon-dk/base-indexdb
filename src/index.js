class baseIndexDb {
    constructor(dbName, storeName) {
      this.dbName = dbName;
      this.storeName = storeName;
      this.db = null;
  
      this.openDB = () => new Promise((resolve, reject) => {
        const request = indexedDB.open(this.dbName, 1);
  
        request.onupgradeneeded = (event) => {
          const db = event.target.result;
          if (!db.objectStoreNames.contains(this.storeName)) {
            db.createObjectStore(this.storeName, { keyPath: 'id', autoIncrement: true });
          }
        };
  
        request.onsuccess = (event) => {
          this.db = event.target.result;
          resolve(this.db);
        };
  
        request.onerror = (event) => {
          reject(event.target.error);
        };
      });
  
      this.withDB = (callback) => new Promise(async (resolve, reject) => {
        if (!this.db) {
          try {
            await this.openDB();
          } catch (error) {
            reject(error);
            return;
          }
        }
  
        const transaction = this.db.transaction([this.storeName], 'readwrite');
        const store = transaction.objectStore(this.storeName);
  
        transaction.oncomplete = () => {
          resolve();
        };
  
        transaction.onerror = (event) => {
          reject(event.target.error);
        };
  
        callback(store);
      });
    }
  
    add(data) {
      return this.withDB((store) => {
        return new Promise((resolve, reject) => {
          const request = store.add(data);
          request.onsuccess = () => {
            resolve(request.result);
          };
          request.onerror = (event) => {
            reject(event.target.error);
          };
        });
      });
    }
  
    getAll() {
      return this.withDB((store) => {
        return new Promise((resolve, reject) => {
          const request = store.getAll();
          request.onsuccess = () => {
            resolve(request.result);
          };
          request.onerror = (event) => {
            reject(event.target.error);
          };
        });
      });
    }
  
    getById(id) {
      return this.withDB((store) => {
        return new Promise((resolve, reject) => {
          const request = store.get(id);
          request.onsuccess = () => {
            resolve(request.result);
          };
          request.onerror = (event) => {
            reject(event.target.error);
          };
        });
      });
    }
  
    update(id, newData) {
      return this.withDB((store) => {
        return new Promise((resolve, reject) => {
          const getRequest = store.get(id);
          getRequest.onsuccess = () => {
            const existingData = getRequest.result;
            if (existingData) {
              const updatedData = { ...existingData, ...newData };
              const updateRequest = store.put(updatedData, id);
              updateRequest.onsuccess = () => {
                resolve(updateRequest.result);
              };
              updateRequest.onerror = (event) => {
                reject(event.target.error);
              };
            } else {
              reject(new Error(`Data with id ${id} not found.`));
            }
          };
          getRequest.onerror = (event) => {
            reject(event.target.error);
          };
        });
      });
    }
  
    remove(id) {
      return this.withDB((store) => {
        return new Promise((resolve, reject) => {
          const request = store.delete(id);
          request.onsuccess = () => {
            resolve();
          };
          request.onerror = (event) => {
            reject(event.target.error);
          };
        });
      });
    }
  }
  
  export default baseIndexDb;
  