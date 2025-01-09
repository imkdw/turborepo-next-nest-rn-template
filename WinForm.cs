using System.Windows.Forms;

namespace TestApp
{
    public partial class Form1 : Form
    {
        private Button testButton;

        public Form1()
        {
            InitializeComponent();
            SetupButton();
        }

        private void SetupButton()
        {
            testButton = new Button
            {
                Text = "테스트 버튼",
                Location = new System.Drawing.Point(100, 100),
                Size = new System.Drawing.Size(100, 30),
                Name = "testButton1"
            };

            testButton.Click += (s, e) => MessageBox.Show("버튼이 클릭되었습니다!");
            Controls.Add(testButton);
        }

        static class Program
        {
            [STAThread]
            static void Main()
            {
                Application.EnableVisualStyles();
                Application.SetCompatibleTextRenderingDefault(false);
                Application.Run(new Form1());
            }
        }
    }
}