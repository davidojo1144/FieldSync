import { Model } from '@nozbe/watermelondb'
import { field, children, date, readonly } from '@nozbe/watermelondb/decorators'

export default class Project extends Model {
  static table = 'projects'
  static associations = {
    tasks: { type: 'has_many', foreignKey: 'project_id' },
  }

  @field('name') name
  @field('description') description
  @readonly @date('created_at') createdAt
  @readonly @date('updated_at') updatedAt
  @children('tasks') tasks
}
