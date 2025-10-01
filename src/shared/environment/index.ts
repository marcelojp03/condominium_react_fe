
// Configuración base común
const baseConfig = {
  /**
   * Define la cantidad de líneas a ser cargadas por defecto en las listados
   */
  LIMITE_DE_LINHAS: 5,
  /**
   * Placeholder exhibido en los inputs
   */
  INPUT_DE_BUSCA: 'Buscar...',
  /**
   * Texto exhibido cuando ningún registro es encontrado en un listado
   */
  LISTAGEM_VAZIA: 'Ningún registro encontrado.',
};

// Configuración por ambiente
const environments = {
  development: {
    ...baseConfig,
    URL_BASE: 'http://127.0.0.1:8000',
    API_TIMEOUT: 30000,
    ENABLE_LOGS: true,
  },
  production: {
    ...baseConfig,
    URL_BASE: import.meta.env.VITE_API_URL || 'https://api-produccion.tudominio.com',
    API_TIMEOUT: 10000,
    ENABLE_LOGS: false,
  },
};

// Detectar el ambiente actual
const currentEnv = import.meta.env.MODE as keyof typeof environments;

// Exportar la configuración según el ambiente
export const Environment = environments[currentEnv] || environments.development;
