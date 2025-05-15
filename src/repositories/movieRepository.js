import { Movie } from "../models/movieModel.js";
import { Genre } from "../models/genreModel.js";
import { Language } from "../models/languageModel.js";


class movieRepository {
  //busca por ID
  async getByID(id) {
    try {
      return await Movie.findById(id).lean()

    } catch (error) {
      console.error(`se produjo un error: ${error} `)
    }
  }

  //devuelve todas las peliculas , 24 por pagina, filtrando el contenido para adulto si corresponde
  async getAll(page = 1, isAdult = false, limit = 24) {
    try {
      const currentPage = parseInt(page) || 1;
      const total = await Movie.countDocuments('');
      const skip = (page - 1) * limit;
      const totalPages = Math.ceil(total / limit);
      const query = isAdult ? {} : { adult: false }; // Filtro para no adultos
      const result = await Movie.find(query).skip(skip).limit(limit).populate({
        path: 'genres',
        select: 'name', // Solo trae el campo 'name'
        options: { strictPopulate: false }
      })

      return {
        pagination: {
          total,
          currentPage,
          totalPages,
          limit,
        },
        data: result,
      }
    } catch (error) {
      console.error(`se produjo un error: ${error} `)
    }
  }

  //busca por atributo y valor
  async findByProp(atributo, valor) {

    // busca por atributo booleano
    if (Movie.schema.paths[atributo].instance === "Boolean" && typeof valor === 'string' && (valor === 'true' || valor === 'false')) {
      // Convertir string a booleano
      const booleanValue = valor === 'true';
      const query = { [atributo]: booleanValue };
      return await Movie.find(query);
    }
    // busca por atributo numerico
    if (!isNaN(valor)) {
      const query = { [atributo]: valor }
      return await Movie.find(query)
    }
    else {// busca por atributo string
      const query = { [atributo]: new RegExp(valor, 'i') }
      return await Movie.find(query)
    }
  }

  //busca los top 5 por un campo
  async getTopByField(field, limit = 5, isAdult) {
    const query = isAdult ? {} : { adult: false }; // Filtro para no adultos
    return Movie.find(query)
      .sort({ [field]: -1 })
      .limit(limit)
      .select('-__v -_id')
      .exec();
  };


  //crea una nueva pelicula
  async createMovie(data) {
    try {
      const newMovie = await Movie.create(data)
      return newMovie

    } catch (error) {
      console.error(`se produjo un error: ${error} `)
      throw new Error(`Error al crear la película: ${error.message}`);
    }
  }

  //actualiza una pelicula
  async updateMovie(id, data) {
    try {
      const movie = await Movie.findByIdAndUpdate(id, { $set: data }, { new: true, upsert: true })
      return movie

    } catch (error) {
      throw ('se produjo un error al intentar actualizar: ', error)
    }
  }

  //borra una pelicula
  async deleteMovie(id) {
    const movie = await Movie.findByIdAndDelete(id)
    return movie
  }

  // devuel el genero del id indicado
  async getGenre(id) {
    try {
      const query = { id: id }
      const genre = await Genre.findOne(query)     
      return genre.name

    } catch (error) {
      console.error(`se produjo un error: ${error} `)
    }
  }

//devuelve todos los generos
  async getAllGenres() {
    try {
      const genres = await Genre.find()
      return genres
    } catch (error) {
      console.error(`se produjo un error: ${error} `)
    }
  }

  //devuel el idioma del id indicado
  async getLanguage(iso) {
    try {
      const query = { iso_639_1: iso }
      const language = await Language.findOne(query)
      return language.english_name
    } catch (error) {
      console.error(`se produjo un error: ${error} `)
    }
  }

//devuelve todos los idiomas
  async getAllLanguages() {
    try {
      const languages = await Language.find()
      return languages

    } catch (error) {
      console.error(`se produjo un error: ${error} `)
    }
  }
}

export default new movieRepository()