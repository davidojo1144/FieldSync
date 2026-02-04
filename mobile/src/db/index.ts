import { Database } from '@nozbe/watermelondb'
import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite'

import schema from './schema'
import Project from './models/Project'
import Task from './models/Task'

const adapter = new SQLiteAdapter({
  schema,
  jsi: true,
  onSetUpError: error => {
    console.error('Database failed to load', error)
  }
})

const database = new Database({
  adapter,
  modelClasses: [
    Project,
    Task,
  ],
})

export default database
