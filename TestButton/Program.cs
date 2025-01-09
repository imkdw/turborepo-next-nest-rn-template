using System;
using System.Windows.Forms;
using System.Drawing;

public class MainForm : Form
{
    private Button btnFood;
    private Button btnPlan;
    private Button btnMessage;

    public MainForm()
    {
        this.Text = "테스트 프로그램";
        this.Size = new Size(400, 300);

        btnFood = new Button
        {
            Text = "먹거리주문",
            Location = new Point(50, 50),
            Size = new Size(120, 30),
            Name = "btnFood"
        };

        btnPlan = new Button
        {
            Text = "요금제주문",
            Location = new Point(50, 100),
            Size = new Size(120, 30),
            Name = "btnPlan"
        };

        btnMessage = new Button
        {
            Text = "메세지",
            Location = new Point(50, 150),
            Size = new Size(120, 30),
            Name = "btnMessage"
        };

        Controls.Add(btnFood);
        Controls.Add(btnPlan);
        Controls.Add(btnMessage);
    }

    [STAThread]
    static void Main()
    {
        Application.EnableVisualStyles();
        Application.SetCompatibleTextRenderingDefault(false);
        Application.Run(new MainForm());
    }
}