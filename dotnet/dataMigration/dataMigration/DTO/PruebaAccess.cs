using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace dataMigration.DTO
{
    class PruebaAccess
    {
        public int Id { get; set; }
        public string Prueba { get; set; }
        public DateTime? FechaSalida { get; set; }
        public DateTime? FechaEntrada { get; set; }
        public string Comentario { get; set; }
        public bool Manana { get; set; }
        public bool Tarde { get; set; }
        public bool Manana2 { get; set; }
        public bool Tarde2 { get; set; }

    }
}
