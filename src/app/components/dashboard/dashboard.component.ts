import { Component, OnInit, OnDestroy } from '@angular/core';
import * as echarts from 'echarts';
import { interval, Subscription } from 'rxjs';
import { LibroService } from '../../services/libro/libro.service';
import { AutorService } from '../../services/autor/autor.service';
import * as moment from 'moment-timezone';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, OnDestroy {
  libros: any[] = [];
  authors: any[] = [];
  chartInstance: any;
  addRecordsSubscription: Subscription | null = null;
  isAddingRecords: boolean = false;
  timezone = 'America/Lima';
  recordCount: number = 0;

  constructor(private libroService: LibroService, private authorService: AutorService) { }

  ngOnInit(): void {
    this.fetchData();
  }

  ngOnDestroy(): void {
    if (this.addRecordsSubscription) {
      this.addRecordsSubscription.unsubscribe();
    }
  }

  fetchData(): void {
    this.libroService.getLibros().subscribe(libros => {
      this.libros = libros;
      this.recordCount = this.libros.length;
      this.initCharts();
    });
    this.authorService.getAuthors().subscribe(authors => {
      this.authors = authors;
      this.initCharts();
    });
  }

  initCharts(): void {
    this.initBarChart();
    this.initPieChartLibrosPublicados();
    this.initPieChartGeneroAutores();
    this.initLineChart();
  }

  initBarChart(): void {
    const chartDom = document.getElementById('barChart')!;
    const myChart = echarts.init(chartDom);
    const option = {
      title: {
        text: 'Libros por Año'
      },
      tooltip: {},
      xAxis: {
        type: 'category',
        data: [...new Set(this.libros.map(libro => libro.year))]
      },
      yAxis: {
        type: 'value'
      },
      series: [{
        data: this.getBooksPorAnio(),
        type: 'bar'
      }]
    };
    myChart.setOption(option);
  }

  getBooksPorAnio(): any[] {
    const years = [...new Set(this.libros.map(libro => libro.year))];
    const counts = years.map(year => this.libros.filter(libro => libro.year === year).length);
    return counts;
  }

  initPieChartLibrosPublicados(): void {
    const chartDom = document.getElementById('pieChartLibrosPublicados')!;
    const myChart = echarts.init(chartDom);
    const option = {
      title: {
        text: 'Libros Publicados',
        left: 'center'
      },
      tooltip: {
        trigger: 'item'
      },
      series: [
        {
          name: 'Libros Publicados',
          type: 'pie',
          radius: '50%',
          data: [
            { value: this.libros.filter(libro => libro.published).length, name: 'Publicados' },
            { value: this.libros.filter(libro => !libro.published).length, name: 'No Publicados' }
          ],
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
      ]
    };
    myChart.setOption(option);
  }

  initPieChartGeneroAutores(): void {
    const chartDom = document.getElementById('pieChartGeneroAutores')!;
    const myChart = echarts.init(chartDom);
    const genres = [...new Set(this.authors.map(author => author.genre))];
    const genreCounts = genres.map(genre => ({
      value: this.authors.filter(author => author.genre === genre).length,
      name: genre
    }));

    const option = {
      title: {
        text: 'Género de Autores',
        left: 'center'
      },
      tooltip: {
        trigger: 'item'
      },
      series: [
        {
          name: 'Género de Autores',
          type: 'pie',
          radius: '50%',
          data: genreCounts,
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
      ]
    };
    myChart.setOption(option);
  }

  initLineChart(): void {
    const chartDom = document.getElementById('lineChart')!;
    this.chartInstance = echarts.init(chartDom);
    const option = {
      title: {
        text: 'Control de registro de Libros'
      },
      tooltip: {
        trigger: 'axis'
      },
      xAxis: {
        type: 'category',
        data: this.libros.map(libro => this.formatDateToPeruTime(libro.registrationDate))
      },
      yAxis: {
        type: 'value'
      },
      series: [{
        data: this.libros.map((libro, index) => index + 1),
        type: 'line'
      }]
    };
    this.chartInstance.setOption(option);
  }

  formatDateToPeruTime(date: string): string {
    return moment.tz(date, 'UTC').tz(this.timezone).format('YYYY-MM-DD HH:mm:ss');
  }

  updateLineChart(): void {
    if (this.chartInstance) {
      const option = this.chartInstance.getOption();
      option.xAxis[0].data = this.libros.map(libro => this.formatDateToPeruTime(libro.registrationDate));
      option.series[0].data = this.libros.map((libro, index) => index + 1);
      this.chartInstance.setOption(option);
    }
  }

  addRandomRecords(): void {
    const newRecords = [];
    for (let i = 0; i < 2000; i++) {
      const randomYear = 2000 + Math.floor(Math.random() * 21);
      const randomAuthor = this.authors[Math.floor(Math.random() * this.authors.length)];
      const newRecord = {
        id: Date.now() + i,
        title: `Random Title ${i}`,
        description: `Random Description ${i}`,
        author: randomAuthor.id,
        published: Math.random() > 0.5,
        year: randomYear,
        registrationDate: new Date().toISOString()
      };
      newRecords.push(newRecord);
    }
    this.libros = this.libros.concat(newRecords);
    this.recordCount = this.libros.length;
    this.updateLineChart();
  }

  toggleAddRecords(): void {
    if (this.isAddingRecords) {
      if (this.addRecordsSubscription) {
        this.addRecordsSubscription.unsubscribe();
      }
    } else {
      this.addRecordsSubscription = interval(5000).subscribe(() => this.addRandomRecords());
    }
    this.isAddingRecords = !this.isAddingRecords;
  }
}

