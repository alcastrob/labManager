using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace dataMigration.DTO
{
    class Prueba
    {
        public int IdPrueba { get; set; }
        public int IdTrabajo { get; set; }
        public string Descripcion { get; set; }
        public DateTime? FechaSalida { get; set; }
        public DateTime? FechaEntrada { get; set; }
        public string Comentario { get; set; }
    }
}
