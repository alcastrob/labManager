using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace dataMigration.DTO
{
    class Dentista
    {
        public int IdDentista { get; set; }
        public string NombreDentista { get; set; }
        public string NombreClinica { get; set; }
        public string DatosFiscales { get; set; }
        public string Direccion { get; set; }
        public string DatosBancarios { get; set; }
        public string DatosInteres { get; set; }
        public string CorreoElectronico { get; set; }
        public string CP { get; set; }
        public string Poblacion { get; set; }
        public string Tlf { get; set; }
        public string OtroTlf { get; set; }
    }
}
