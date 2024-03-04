```bash
npm i base-indexdb
```
```js
import baseIndexdb from './base-indexdb';

// 创建 baseIndexdb 实例，指定数据库名称和存储对象名称
const dbWrapper = new baseIndexdb('myDatabase', 'myStore');

// 添加数据
const newData = { name: 'John Doe', age: 30 };
dbWrapper.add(newData)
  .then(id => console.log(`Data added with id: ${id}`))
  .catch(error => console.error('Error adding data:', error));

// 获取所有数据
dbWrapper.getAll()
  .then(data => console.log('All data:', data))
  .catch(error => console.error('Error getting data:', error));

// 根据ID获取数据
const targetId = 1;
dbWrapper.getById(targetId)
  .then(data => console.log(`Data with id ${targetId}:`, data))
  .catch(error => console.error(`Error getting data with id ${targetId}:`, error));

// 更新数据
const updateId = 1;
const updatedData = { age: 31 };
dbWrapper.update(updateId, updatedData)
  .then(() => console.log(`Data with id ${updateId} updated successfully`))
  .catch(error => console.error(`Error updating data with id ${updateId}:`, error));

// 删除数据
const deleteId = 1;
dbWrapper.remove(deleteId)
  .then(() => console.log(`Data with id ${deleteId} deleted successfully`))
  .catch(error => console.error(`Error deleting data with id ${deleteId}:`, error));

```