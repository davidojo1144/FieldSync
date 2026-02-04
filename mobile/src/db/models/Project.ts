import { Model, Query } from '@nozbe/watermelondb'
import { field, children, date, readonly } from '@nozbe/watermelondb/decorators'
import { Associations } from '@nozbe/watermelondb/Model'
import Task from './Task'

export default class Project extends Model {
  static table = 'projects'
  static associations: Associations = {
    tasks: { type: 'has_many', foreignKey: 'project_id' },
  }

  @field('name') name!: string
  @field('description') description?: string
  @readonly @date('created_at') createdAt!: Date
  @readonly @date('updated_at') updatedAt!: Date
  @children('tasks') tasks!: Query<Task>
}
