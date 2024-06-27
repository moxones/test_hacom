export class Libro {
    id: number;
    title: string;
    description: string;
    author: number;
    published: boolean;
    year: number;
    registrationDate: Date;
  
    constructor(
      id: number,
      title: string,
      description: string,
      author: number,
      published: boolean,
      year: number,
      registrationDate: Date
    ) {
      this.id = id;
      this.title = title;
      this.description = description;
      this.author = author;
      this.published = published;
      this.year = year;
      this.registrationDate = registrationDate;
    }
  }
  