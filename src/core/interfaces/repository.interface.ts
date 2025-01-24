export interface EntityRepository<T> {
  findByIdOrNotFoundException(id: string): Promise<T>;
  save(entity: T): Promise<void>;
}
