import { Model } from '@nozbe/watermelondb'
import { field, relation, date, readonly } from '@nozbe/watermelondb/decorators'

export default class Task extends Model {
  static table = 'tasks'
  static associations = {
    projects: { type: 'belongs_to', key: 'project_id' },
  }

  @field('title') title
  @field('status') status
  @relation('projects', 'project_id') project
  @readonly @date('created_at') createdAt
  @readonly @date('updated_at') updatedAt
}
