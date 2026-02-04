CREATE TABLE IF NOT EXISTS projects (
  id VARCHAR(255) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  created_at BIGINT NOT NULL,
  updated_at BIGINT NOT NULL
);

CREATE TABLE IF NOT EXISTS tasks (
  id VARCHAR(255) PRIMARY KEY,
  project_id VARCHAR(255) REFERENCES projects(id),
  title VARCHAR(255) NOT NULL,
  status VARCHAR(50) NOT NULL,
  created_at BIGINT NOT NULL,
  updated_at BIGINT NOT NULL
);
