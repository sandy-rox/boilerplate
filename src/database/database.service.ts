import { Injectable } from '@nestjs/common';
import { DataSource, EntityManager, EntityTarget, Repository } from 'typeorm';

@Injectable()
export class DatabaseService {
  constructor(private readonly dataSource: DataSource) {}

  // **1. Get Repository (Generic Method)**
  getRepository<T>(entity: EntityTarget<T>): Repository<T> {
    return this.dataSource.getRepository(entity);
  }

  // **2. Check Database Connection**
  async checkDatabaseStatus(): Promise<boolean> {
    try {
      const connection = this.dataSource.isInitialized; // Check if the connection is initialized
      return connection;
    } catch (error) {
      console.error('Database connection failed:', error);
      throw new Error('Database connection failed');
    }
  }

  // **3. Run Raw SQL Query**
  async runRawQuery(query: string, parameters?: any[]): Promise<any> {
    try {
      const result = await this.dataSource.query(query, parameters);
      return result;
    } catch (error) {
      console.error('Error running raw query:', error);
      throw new Error('Error running raw query');
    }
  }

  // **4. Run Transaction**
  async runTransaction<T>(
    operations: (entityManager: EntityManager) => Promise<T>,
  ): Promise<T> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.startTransaction();
    try {
      const result = await operations(queryRunner.manager);
      await queryRunner.commitTransaction();
      return result;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.error('Transaction failed:', error);
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
